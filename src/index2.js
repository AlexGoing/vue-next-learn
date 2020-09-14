import {reactive, effect, ref, computed} from './reactivity'
// 用proxy进行代理, 对数据进行了代理，可以获取，可以设置
const state = reactive({name: 'gsx', number: '20000', arr: [1, 2, 3]});

// state.name;
// state.name = 'gaojing';
// console.log(state.arr)
state.arr.pop()
// effect(() => {
//     console.log(state.name)
// })
// state.name = 'gaojing'

