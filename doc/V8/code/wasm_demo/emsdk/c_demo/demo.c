#include <stdio.h> // 引入标准输入输出库

// 声明加法函数
int add(int, int);

// 主函数
int main(int argc, char const *argv[]) {

    printf("hello WebAssembly!\n");
    printf("%d\n", add(10, 20));
    return 0;
}

// 加法函数
int add( int x, int y) {
    return x + y;
}
