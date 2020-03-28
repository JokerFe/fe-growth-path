<template>
    <div ref="app">
        <div>{{count}}</div>
        <button @click="add">+1</button>
    </div>
</template>
<script>
import { reactive, toRefs } from "@vue/composition-api";
export default {
    name: "toRefs",
    setup() {
        const state = reactive({
            count: 0
        });
        const add = () => [state.count++];

        return {
            ...toRefs(state),
            add
        };
    }
};
</script>