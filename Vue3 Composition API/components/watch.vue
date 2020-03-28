<template>
    <div>
        <input type="text" v-model="keyword" />
    </div>
</template>
<script>
import { ref, reactive, watch } from "@vue/composition-api";
export default {
    setup() {
        // // 基础用法
        // const refCount = ref(0);
        // watch(() => console.warn(refCount.value));
        // setInterval(() => {
        //     refCount.value++;
        // }, 1000);

        // 监视多个数据
        // reactive
        const state = reactive({ count: 0, name: "jokul" });
        watch(
            [() => state.count, () => state.name],
            ([newCount, newName], [oldCount, oldName]) => {
                console.log(
                    `reactive $count 旧值：${oldCount}; 新值：${newCount}`
                );
                console.log(
                    `reactive $name 旧值：${oldName}; 新值：${newName}`
                );
            },
            {
                lazy: true
            }
        );

        setTimeout(() => {
            state.count = 27;
            state.name = "Jokul";
        }, 2000);

        // ref
        let refCount = ref(0);
        let refName = ref("guohh");
        watch(
            [refCount, refName],
            ([newCount, newName], [oldCount, oldName]) => {
                console.log(`ref $count 旧值：${oldCount}; 新值：${newCount}`);
                console.log(`ref $name 旧值：${oldName}; 新值：${newName}`);
            },
            {
                lazy: true
            }
        );

        setTimeout(() => {
            refCount.value = 27;
            refName.value = "Jokul";
        }, 2000);

        // 清除监听 --- 一个简单的防抖功能
        const keyword = ref("");

        const asyncprint = val => {
            return setTimeout(() => {
                console.log(val);
            }, 1000);
        };

        watch(
            keyword,
            (newVal, oldVal, clean) => {
                const timer = asyncprint(newVal);
                clean(() => clearTimeout(timer));
            },
            { lazy: true }
        );

        return { keyword };
    }
};
</script>