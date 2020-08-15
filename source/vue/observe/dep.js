

let id = 0
// 订阅和发布
export class Dep{
    constructor() {
        this.id = id ++
        this.subs = []
    }
    // 发布订阅模式： 订阅 - 就是将调用addSub时传入的内容保存到数组中
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.updata() // watcher 中的updata方法
        })
    }
    depend() {
        if(Dep.target) {    // 为了防止外界直接调用depend方法，先判断下
            Dep.target.addDep(this) // Dep.target是一个渲染watcher，这样做目的：在watcher中记忆Dep
        }
    }
}

/**
 * 栈 - 先进后出
 * 用来保存当前的watcher
 */
const stack = []
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}
/**
 * 当栈只有一个watcher时，调用popTarget，Dep.tartget 为null
 */
export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

