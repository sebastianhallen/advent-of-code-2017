#include <stdio.h>

int a = 1;
int b = 0;
int c = 0;
int d = 0;
int e = 0;
int f = 0;
int g = 0;
int h = 0;

void init() {
  b = 84;
  c = b;
  if (a == 0) {
    return;
  }

  b = b * 100;
  b = b + 100000;
  c = b;
  c = c + 17000;
}

void registers() {
  printf("a: %d\tb: %d\tc: %d\td: %d\te: %d\tf: %d\tg: %d\th: %d\n", a, b, c, d, e, f, g, h);
}

int main() {
  init();
  do {
    f = 1;    // set f 1
    d = 2;    // set d 2
    do {
      e = 2;  // set e 2
      do {
        g = d;      // set g d
        g = g * e;  // mul g e
        g = g - b;  // sub g b
        if (g > b) {
         break;
        }
        if (g == 0) { // jnz g 2
          f = 0;      // set f 0
          break;
        }
        ++e;          // sub e -1
        g = e;        // set g e
        g = g - b;    // sub g b
      } while (g != 0); // jnz g -8
      if (f == 0) {
        break;
      }
      ++d;        // sub d -1
      g = d;      // set g d
      g = g - b;  // sub g b
    } while (g != 0); // jnz g -13

    registers();
    if (f == 0) { // jnz f 2
      ++h;     // sub h -1
      printf("increased h to: %d -- ", h);
      registers();
    }
    g = b;      // set g b
    g = g - c;  // sub g c

    if (g != 0) { // // jnz g 2
      b = b + 17; // sub b -17
    }

    if (g == 0) { // jnz 1 3
      registers();
      printf("done -- h: %d\n", h);
      return(0);
    }
  } while(1); // jnz 1 -23
}
