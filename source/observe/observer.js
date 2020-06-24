


import { observe } from "./index";
import { newObje, observerArray } from "./array";
import { Dep } from './dep'
/** 
 * 数据响应式处理
 * 总结下：调用数组变异方法、this.$set、直接覆盖data中的数据，会触发vue的响应式
 */
export class Observer{
    constructor(data) {
        this.dep = new Dep()                     // 此dep专门为数组设定
        Object.defineProperty(data, '__ob__', {  // 每个对象 包括数组，都会有一个__ob__属性，返回的是当前Observer实例
            get: () => this    
        })
        
            // 将用户数据使用defineProperty重新定义
        if (Array.isArray(data)) {
            // 当外界使用data中数组调用数组方法时，会首先到data.__proto__原型链上去查找
            // 这块只能对数组方法进行拦截和对数组方法的参数进行响应式处理，但是未对数组参数进行响应式处理
            // （假如数组元素是一个对象，需要做响应式处理）
            // 拦截数组方法 —— 进行观测
            data.__proto__ = newObje
            // 拦截数组每一项 — — 进行观测， 对数组中的对象或数组 - 进行响应式处理，如果数组中是1，2，3数字或字符串的话，不会被观测
            // 当调用数组方法时，需要手动通知
            observerArray(data)
        } else {
            // data为对象时，会调用此方法
            this.walk(data)
        }
    }
    // walk 方法是针对 - 对象
    walk(data) {
        Object.keys(data).forEach(item => {
            let key = item
            let value = data[item]
            defineReactive(data, key, value)
        })
    }
}

/**
 * 定义响应式数据变化
 */
function defineReactive(data, key, value) {
    
    let childOb = observe(value)        // 递归调用判断value是否是一个对象, new Objserver
    let dep = new Dep()                 // dep 可以收集依赖, 收集的是 watcher 
    Object.defineProperty(data, key, {  // vue 不支持ie8 及以下浏览器的原因
        get() {                         // 取值时，收集依赖
            if(Dep.target) {   // 判断是否有渲染watcher
                               // 我们希望存入的watcher不能重复，如果是重复了会造成多次渲染！！！
                dep.depend()   // 让dep中可以存放watcher，同时也可以让watcher中存放dep，实现多对多的关系，双向记忆！
                if (childOb) {
                    childOb.dep.depend()// 数组也收集了当前的渲染watcher
                }
            }
                             // console.log('取值', value)
            return value
        },
        set(newValue) {
            if(newValue === value) return
            // console.log('赋值了,新值为：', newValue)
            // 如果设置的值还是一个对象，递归调用observer做响应式处理，在实际开发中，如果给data中的数组或对象重新赋值，
            // 且值为对象或数组都会被做响应式处理
            observe(newValue)
            value = newValue
            dep.notify() // 赋值时，会把刚才存的watcher 重新执行         
        }
    })
}
