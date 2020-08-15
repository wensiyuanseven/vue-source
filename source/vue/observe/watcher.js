


let id = 0
import { pushTarget, popTarget } from "./dep";
export class Watcher{
    /**
     * vm: vue 实例
     * exprOrFn：用户可能传入的是一个表达式，也有可能是一个函数
     * cb: 用户传入的回调函数 vm.$watch('msg', cb)
     * opts: 一些其他的参数
     */
    constructor(vm, exprOrFn, cb=()=>{}, opts={}) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn  // getter 就是new Watcher传入的第二个参数
        }
        this.cb = cb
        this.opts = opts
        this.deps = []              // 存放的是dep的id，
        this.depIds = new Set()
        this.id = id ++
        // 只要new Watcher 就会调用自身的get方法 -> this.getter()执行 -> exprOfFn执行 -> updateComponent 执行
        // vm._updata 执行 -> 组件被更新
        this.get()
    }
    get() {
        pushTarget(this)    // 第一次，会让渲染watcher 入栈, 让 Dep.target = watcher
                            // 组件更新 ，具体：更新前需要获取data中的数据，它会走getter，get方法中会判断是否有def.target
                            // 有，则会把def.target也就是渲染watcher 收集起来 -> this.subs = [watcher]
                            // 当用户修改data中的属性时，会调用set方法 -> dep.notify() -> this.subs.forEach(watcher.updata())
        this.getter()
        popTarget()         // 当前 渲染watcher 出栈 ---> Dep.target = undefined
    }
    addDep(dep) {           // 同一个watcher不应该重复记录dep
        let id = dep.id     // 获取到dep的id
        if(!this.depIds.has(id)) {   // 判断下set中是否有id，没有才能添加dep的id
            this.depIds.add(id)      // 向set中添加dep的id
            this.deps.push(dep)      // 让watcher记住dep
            dep.addSub(this)         // push watcher到 this.subs 中
        }
    }
    updata() { //解决多次赋值同一变量，如果立即调用get，会立即更新页面，需要异步更新
        queueWatcher(this)
        // this.get()
    }
    run() {
        this.get()
    }
}

let has = {}
let queue = [] // 如果是相同的watcher，只会存一个watcher
function flushQueue() {
    // 等待当前这一轮更新后，再去让watcher 一次执行
    queue.forEach(watcher => watcher.run())
    has = {}
    queue = []
}
function queueWatcher(watcher) {
    let id = watcher.id
    if (has[id] === undefined) {
        has[id] = true
        queue.push(watcher)         // 相同的watcher只会存一个
        // 延迟请空队列(等到所有都被赋值完成，才会调用下边定时器
        // vm.name = '1'
        // vm.name = '2'
        // vm.name = '3'
        // ··· ···
        // 以上赋值的操作都是同步的，异步方法会等待所有同步方法执行完毕后在调用
        //  vue中是用的nextTick来实现的异步更新
        // setTimeout(flushQueue, 0)
        nextTick(flushQueue)
    }
}
let callBacks = []
function flushCallBack(cb) {
    cb.forEach(cb => cb())
}
function nextTick(cb) {
    callBacks.push(cb)
    // 要异步刷新这个callBacks, 获取一个异步的方法
    // vue 中是采用的微任务：会先执行 微任务 - promise、mutationObserver  或 宏任务 - setImmediate、setTimeout
    let timerFunction = () => {
        flushCallBack(callBacks)
    }
     // 判断浏览器是否支持Promise，支持则用Promise
    if (Promise) {
       return Promise.resolve().then(timerFunction)
    }
    setTimeout(flushQueue, 0)
}
// 等待页面更新之后，再去获取dom元素
// Vue.nextTick(() => {})






