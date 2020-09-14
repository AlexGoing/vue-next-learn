import { isFunction } from "../shared/utils";
import { effect, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operation";

export function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {}
    }else{
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    // 默认第一次取值是执行getter方法的
    let dirty = true; 
    let computed;
    // 计算属性也是一个effect 
    let runner = effect(getter,{
        // 懒加载标识
        lazy: true,
        // 这里仅仅是标识而已 是一个计算属性
        computed: true,
        scheduler:()=>{
            if(!dirty){
                // 计算属性依赖的值发生变化后 就会执行这个scheduler
                dirty = true;
                trigger(computed,TriggerOpTypes.SET,'value')
            }
        }
    })
    let value;
    computed = {
        get value(){
            // 多次取值 不会重新执行effect
            if(dirty){ 
                value = runner();
                dirty = false;
                track(computed,TrackOpTypes.GET,'value')
            }
            return value;
        },
        set value(newValue){
            setter(newValue);
        }    
    }
    return computed;
}