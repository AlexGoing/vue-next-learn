export function effect(fn, options = {}) {
    // 数据一遍 自动更新
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
// 创建响应式effect
let uid = 0;
let activeEffect;
const effectStack = [];
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            // 是一个依赖收集的过程
            try {
                effectStack.push(effect);
                // 将effect放到了当前effect上
                activeEffect = effect;
                // 计算属性会用到
                return fn();
            }
            finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length -1]
            }
        }
    }
    effect.options = options;
    effect.id = uid++;
    // 依赖了哪些属性
    effect.deps = []
    // todo
    return effect;
}
const targetMap = new WeakMap();
export function track(target, type, key) {
    // 如果当前没有activeEffect
    if (activeEffect == undefined) {
        return;
    }
    // 根据key进行取值
    let depsMap = targetMap.get(target);
    // 如果没有key，就构建一个
    if(!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    // 如果没有dep就接着构建
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    // 防止effect中多次记录
    // 这里dep就是set
    if(!dep.has(activeEffect)) {
        // 属性依赖了effect
        dep.add(activeEffect);
        // 让这个effect记录dep属性
        activeEffect.deps.push(dep);
    }
}
export function trigger(target, type, key) {
    // 获取当前对应的map
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    // const run = (effects) => {
    //     if (effects) {
    //         effects.forEach(effect => effect())
    //     }
    // }
    const effects = new Set();
    const computedRunners = new Set();
    const add = (effectToAdd) => {
        if (effectToAdd) {
            effectToAdd.forEach((effect) => {
                if (effect.options.computed) {
                    computedRunners.add(effect)
                }
                else {
                    effects.add(effect)
                }
            })
        }
    }
    // 触发的时候判断两种情况，判断是修改还是添加
    if (key !== null) {
        // 去执行map下对应的key的effect
        add(depsMap.get(key));
    }
    if (type === 'add') {
        // 对数组新增属性 会触发length对应的依赖，在取值的时候会对length进行依赖收集
        add(depsMap.get(Array.isArray(target) ? 'length' : ''))
    }

    const run = (effect) => {
        // 计算属性的调度器
        if (effect.options.scheduler) {
            effect.options.scheduler();
        }
        else {
            effect();
        }
    }
    computedRunners.forEach(run);
    effects.forEach(run);
} 