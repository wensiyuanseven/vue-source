

import { Observer } from "./observer";
/**
 * 初始化data、computed、watch
 *
 */
export function initState(vm) {
    let opt = vm.$option
    if(opt.data) {
        initData(vm)
    }
    if(opt.computed) {
        initComputed()
    }
    if(opt.watch) {
        initWatch()
    }
}

/**
 *
 * 访问data属性代理 vm['name'] === vm._data.['name']
 *
 */
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

/**
 *
 * @param data  data数据
 * @returns {Observer} 把data数据对象进行响应式处理及依赖收集
 * data 是否一个对象 {}、[]
 */
export function observe(data) {
    if (typeof data !== 'object' || data === null) return
    return new Observer(data) // 如果是对象，会创建一个观测者，是对象变为响应式, 当然数组也需要进行依赖观测
}

/**
 *
 * @param vm 初始化data
 */
function initData(vm) {
    let data = vm.$option.data
    // vm._data 临时变量 - 私有的
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data) // 观察数据
}
