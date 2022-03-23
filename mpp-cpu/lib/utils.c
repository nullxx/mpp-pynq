//
//  utils.c
//  mpp-cpu
//
//  Created by Jon Lara trigo on 21/3/22.
//

#include "utils.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int hex_to_int(const char *hex) {
    int number = (int)strtol(hex, NULL, 16);
    return number;
}

char *int_to_hex(int num) {  // TODO check malloc failures
    int size = 4;
    char *result = malloc(sizeof(char) * (size + 1));
    if (result == NULL) {
        goto error;
    }

    snprintf(result, size, "%x", num);

    while (1) {
        const int next_size = size + 1;
        char *result2 = malloc(sizeof(char) * (next_size + 1));
        snprintf(result2, next_size, "%x", num);

        if (!strcmp(result, result2)) break;

        free(result);
        result = result2;

        size++;
    }
error:
    return result;
}

int random_int(const int end_bound) {
    int r = rand() % end_bound + 1;
    return r;
}

unsigned long long str_to_bin(const char *s) {
    unsigned long long i = 0;
    while (*s) {
        i <<= 1;
        i += *s++ - '0';
    }
    return i;
}

int get_bin_len(unsigned long long bin) {
    const int bin_len = (int) log10(bin + 1) + 1;
    return bin_len;
}

char *bin_to_str(unsigned long long bin) {
    const int bin_len = get_bin_len(bin);

    const size_t size = sizeof(char) * (bin_len + 1);
    char *str = malloc(size);

    snprintf(str, size, "%llu", bin);
    // TODO free str
    return str;
}
