#include <iostream>
#include <climits>  // 👈 Add this to use INT_MIN
using namespace std;

int main() {
    int n;
    cin >> n;

    if(n==6){
        int villain = n-6;
        int runTImeDevil = 40/villain;
        cout<<"div by zero l for n=6";
        cout<<runTImeDevil; 
    }

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
