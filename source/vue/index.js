

import { Watcher } from "./observe/watcher";
import { initState } from "./observe";
function Vue(options) {
    this._init(options)
}


/**
 * 初始化
 */
Vue.prototype._init = function(options) {
    let vm = this
    // this.$options
    vm.$option = options
    // initState主要是拦截数组方法及方法中的参数 和 对象属性 进行响应式处理
    // 这里边都是同步的数据 并没有异步
    initState(vm)
    // vue 1.0 编译
    if (vm.$option.el) {
        vm.$mount()
    }
}
/**
 * 正则匹配 - 双括号及里边内容，匹配结果会传到...arg中， 也可以这样写：function($, $1){} $为匹配的全部内容，$1为匹配的双括号中的内容
 */
const reg = /\{\{((.|\r?\n)+?)\}\}/g
let until = {
    // 字符串转数组，解析属性 如：name -> vm.name
    getValue(vm, express) {
        const arr = express.split(".")
        return arr.reduce((prev, next) => {
            prev = prev[next]
            return prev
        }, vm)
    },
    // 匹配双花括号中的文本，及编译文本
    compilerText(node, vm) {
        if (!node.expr) { // 为node添加一个自定义属性，
            node.expr = node.textContent
        }
        node.textContent = node.expr.replace(reg,function (...arg) {
            // console.log(arg) // ["{{name}}", "name", 5, "↵    {{name}}↵    年龄：{{age}}↵    {{obj.name}}↵    "]
            return JSON.stringify(until.getValue(vm, arg[1]))
        })
    }
}
/**
 * 标签 文本编译
 */

 /**
  *
  * @param {*} node
  * @param {*} vm
  */
function compiler(node, vm) {
    let childrenNode = node.childNodes; // 类数组
    [...childrenNode].forEach(child => {
        // 1、元素   3、文本
        if (child.nodeType === 1) {
            compiler(child, vm)
        }else if (child.nodeType === 3) {
            until.compilerText(child, vm)
        }
    })
}

/**
 * @private 用户传入的数据，更新视图
 */
Vue.prototype._updata = function () {
    let vm = this;
    let el = vm.$el;
    // 循环这个元素，将里边的内容 换成 我们的数据
    let node = document.createDocumentFragment();       // 创建一个文档碎片
    let firstChild;
    while (firstChild = el.firstChild) {          // 每次拿到第一个元素，将元素移动到文档碎片中去
        node.appendChild(firstChild);             // appendChild 如果目标存在会被裁剪和移动
    }
    compiler(node, vm)                            // 对文本进行替换
    el.appendChild(node)                          // 最后把解析好的标签一次全部插入到el中
}


/**
 * 判断el
 */
function query(el) {
    if(typeof el === 'string') {
        return document.querySelector(el)
    }
    return el
}
/**
 *  $mount方法 - 触发Watcher -> 数据渲染 ( 数据渲染，需要触发Watcher )
 *  new Watcher（渲染），就会执行下边 updateComponent 执行。
 *  在vue官方文档中，有这么一句话：
 *  每个组件实例都会对应一个watcher实例，它会在组件渲染过程中把 "接触过的" 数据属性记录为依赖。之后当依赖
 *  项的setter触发时，会通知watcher，从而使它关联的组件重新渲染
 */
Vue.prototype.$mount = function () {
    let vm = this
    let el = vm.$option.el            // 获取元素 #app
    el = vm.$el = query(el)           // 返回的是一个dom对象了，获取当前挂载的节点（就是一个元素）
    let updateComponent = () => {     // 渲染时，是通过watcher 来渲染 - 又叫渲染watcher
        vm._updata()                  // 更新（或者初始化）组件
    }
    // debugger;
    new Watcher(vm, updateComponent)  // 页面初始化时，调用一次watcher
    // 如果数据更新了，我们需要再次调用 new  Watcher()
}
export default Vue
