#include <iostream>
#include <vector>
using namespace std;
#include <climits>  // 👈 Add this to use INT_MIN


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
