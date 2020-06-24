

import { observe } from "./index";
export function observerArray(arr) {
    arr.forEach(item => {
        observe(item) // 判断数组参数是否为对象 - 如果是则加上响应式
    })
}
/**劫持数组原生方法
*  如果是数组，需要重写数组的变化，因为当我们使用原生数组方法给data中的数组赋值时，
*  监控不到数组的变化，当然取值时可以监控到的：
 * push unshift pop reverse sort splice 可改变原数组的方法进行重写：
**/
const methods = [
    'push',
    'sort',
    'pop',
    'splice',
    'reverse',
    'unshift'
]
let arrayPrototype = Array.prototype
export let newObje = Object.create(arrayPrototype) // 创建一个原型为数组原生的新对象
methods.forEach(method => {
    // 当外界调用data中的数组时，且使用了数组方法 - 会被先代理到下边的方法，但是内部还是会调用原生的方法，
    // 这样做，就是为了拦截数组方法，在里边加上一些处理逻辑
    newObje[method] = function(...arg) {
        arrayPrototype[method].apply(this, arg)
        // 有可能会push、unshift、splice第三个参数 添加一个对象，也需要做响应式处理
        let arrParams;
        switch(method){
            case 'push':
            case 'unshift':
                arrParams = arg
                break
            case 'splice': // arg.slice(2) 是获取到splice新增的内容，第三个参数
                arrParams = arg.slice(2) // [1,2,3].slice(2) // 3 把参数前2想去掉，拿到第三个参数
                break
        }
        if (arrParams) observerArray(arrParams)
        this.__ob__.dep.notify() // 通知视图更新
        console.log('需要更新视图 - --', this)
    }
})
