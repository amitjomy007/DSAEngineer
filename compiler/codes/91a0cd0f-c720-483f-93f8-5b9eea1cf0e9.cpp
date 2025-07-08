#include <iostream>
#include <limits>

int main() {
    int n;
    std::cin >> n;
    int max_val = std::numeric_limits<int>::min();
    int current_num;
    for (int i = 0; i < n; ++i) {
        std::cin >> current_num;
        if (current_num > max_val) {
            max_val = current_num;
        }
    }
    std::cout << max_val;
    return 0;
}