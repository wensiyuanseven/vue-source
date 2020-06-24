




import Vue from '../source/index.js'
const vm = new Vue({
    el: '#app',
    data() {
        return {
            name: 'i name is lxc',
            obj: {
                name: 'xiao yu'
            },
            age: 70,
            arr: [1, 2, {name: 'l'}]
        }
    }
})

// 好用
// setTimeout(function () {
//     vm.name = '123'
//     vm.name = '1'
//     vm.name = '2'
//     vm.name = '3'
// }, 1000)

// ???
vm.arr.push(4)




// console.log('1', vm.arr.push(3)) // push返回的是push完的数组长度
// console.log('2', vm)



/**
 * 一个组件对应一个dep吗
 * 答： 
 * 一个属性，对应一个dep，但是一个组件对应一个watcher
 * 
 * 如果一个属性多次被赋值，假设赋值10次，那么会被编译10次，性能开销很大，vue源码中会对其进行优化，
 * 只会赋值最后一次。。
 *  异步更新
 * 
 * 
*/


// 任意字符 或 换行 至少一个 尽可能少匹配
// const reg = /\{\{(?:.|\r?\n)+\}\}/g
// const str = `{{
//
// name
//
// }}`
//
// const r = str.match(reg)
//
// console.log(r)




/**
 * 1、data() {
 *     return {
 *         obj: {name: 'lxc'}
 *     }
 * }
 *  取值时 this.obj.name 会会执行二遍 get 方法
 *  第一遍 this.obj
 *  第二遍 this.obj.name
 *
 * 2、什么样的数组会被观测
 *  调用push unshift splice sort pop ，或 vm.$set() 内部调用的是splice方法 或直接覆盖数组，会被观测
 *   （1）改变索引不会被监控到
 *   （2）数组长度的变化不会被监控到
 *
 * 3、 /** + 回车 快速创建一个注释
 * */





// const obj = [{
//     name: 'lxc', age:20,
//     name: 'lx', age:21
// },{
//     name: 'lxc2', age:22,
//     name: 'lx2', age:23
// },{
//     name: 'lxc3', age:24,
//     name: 'lx3', age:25
// }]
//
// obj.forEach(item => {
//     item['a'] = '123'
// })
// console.log(obj)








