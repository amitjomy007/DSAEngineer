#include <vector>
#include <unordered_map>
using namespace std;
#include <iostream>

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];

    int target;
    cin >> target;

    Solution sol;
    vector<int> result = sol.twoSum(nums, target);

    // Instead of printing, return exit code based on result
    // You can handle output capturing outside in your judge

    // Optional: encode result size in exit code for testing (for example only)
    return result.size(); // returns 2 if found, 0 otherwise
}
