#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    int maxVal = INT_MIN;
    for (int i = 0; i < n; ++i) {
        int x;
        cin >> x;
        if (x > maxVal) {
            maxVal = x;
        }
    }

    cout << maxVal << endl;
    return 0;
}
