<template>
    <div class="computed">
        {{computedCountReadOnly}}
        <button @click="refCountReadOnly+=1">+1</button>
        <div>{{computedCountReadWrite}}</div>
    </div>
</template>
<script>
import { ref, computed } from "@vue/composition-api";
export default {
    setup() {
        const refCountReadOnly = ref(0);
        // 只读的计算属性
        const computedCountReadOnly = computed(
            () => refCountReadOnly.value + 1
        );
        // computedCountReadOnly.value = 9; // 这行代码会报错

        // 可读可写的计算属性
        const refCountReadWrite = ref(0);
        const computedCountReadWrite = computed({
            set: val => {
                refCountReadWrite.value = val - 1;
            },
            get: () => refCountReadWrite.value + 1
        });
        computedCountReadWrite.value = 11;

        return {
            refCountReadOnly,
            computedCountReadOnly,
            refCountReadWrite,
            computedCountReadWrite
        };
    }
};
</script>