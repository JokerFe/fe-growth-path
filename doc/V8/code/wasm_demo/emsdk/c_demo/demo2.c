/*
* emcc demo2.c -Os -s WASM=1 -s SIDE_MUDULE=1 -o math.wasm
*/

int add (int x, int y) {
    return x + y;
}

int square(int num ) {
    return num * num;
}