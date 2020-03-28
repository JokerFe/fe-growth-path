<template>
    <div id="app">
        <!-- <SetUp p="props测试数据" /> -->
        <!-- <Ref /> -->
        <!-- <toRefs /> -->
        <!-- <computed /> -->
        <!-- <watch /> -->
        <!-- <lifecycle /> -->
        <!-- <child /> -->
        <!-- <dom /> -->
        <createComponent :foo="foo" />
    </div>
</template>

<script>
// import SetUp from "./components/setup";
// import Ref from "./components/ref";
// import toRefs from "./components/toRefs";
// import computed from "./components/computed";
// import watch from "./components/watch";
// import lifecycle from "./components/lifecycle";
// import child from "./components/child";
// import dom from "./components/dom";
import createComponent from "./components/createComponent";

// import { ref, provide } from "@vue/composition-api";
import { ref } from "@vue/composition-api";
export default {
    name: "App",
    components: {
        // SetUp,
        // Ref,
        // computed,
        // watch,
        // child,
        // dom,
        createComponent
    },
    setup() {
        // const father = ref("父组件传递的");
        // provide("father", father);

        // const foo = ref("foo");
        const foo = ref(0)
        return {
            foo
        };
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
