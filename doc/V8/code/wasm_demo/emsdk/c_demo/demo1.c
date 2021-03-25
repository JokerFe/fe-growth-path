#include <stdio.h>
#include <stdlib.h>
#include <math.h>

extern "C" {
    float getSqr(float num) {
        return num * num;
    }
    float getSqrt(float num) {
        return sqrt(num);
    }
}