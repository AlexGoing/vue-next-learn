import {reactive, effect, ref, computed} from '@vue/reactivity'
const state = reactive({name: 'GSX', number: 20000, arr: [1 , 2, 3]});
const status = ref({
    
})

const all = computed(() => {
    console.log('ok');
    return state.number *2
})

console.log(all)

state.number = 30000

console.log(all.value)