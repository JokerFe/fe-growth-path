<template>
    <div>
        <div>{{count}}</div>
        <button @click="count+=1">+1</button>
    </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
    name: "setup",
    props: {
        p: String
    },
    setup(props, context) {
        console.log(props);
        console.log(context);
        console.log(context.attrs);
        console.log(context.slots);
        console.log(context.parent);
        console.log(context.root);
        console.log(context.emit);
        console.log(context.refs);

        const state = reactive({ count: 0 });
        return state;
    },
    beforeCreate() {
        console.log("beforeCreate");
    },
    created() {
        console.log("beforeCreate");
    }
};
</script>