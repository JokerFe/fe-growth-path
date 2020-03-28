<template>
    <div ref="app">
        <div>{{count}}</div>
        <button @click="count+=1">+1</button>
    </div>
</template>
<script>
import { ref } from "@vue/composition-api";
export default {
    name: "ref",
    setup(props, context) {
        const count = ref("1");
        // console.log(count.value);
        // count.value++;
        // console.log(count.value);
        console.warn(context.refs);
        return {
            count
        };
    },
    beforeCreate() {
        console.log("beforeCreate");
        console.error(this.$refs.app);
    },
    created() {
        console.log("beforeCreate");
        console.error(this.$refs.app);
    }
};
</script>