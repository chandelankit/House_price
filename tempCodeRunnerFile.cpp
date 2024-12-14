#include<bits/stdc++.h>
using namespace std;
#define int long long int

void solve(vector<int>&ans,int k,int n, int idx, int l, int r){

    if(l==r){
        ans[l] = idx;
        return;
    }

    if(r-l-1 < 60 && k > pow(2,r-l-1)){
        ans[r] = idx;
        solve(ans,k-pow(2,r-l-1),n,idx+1,l,r-1);

    }
    else{

        ans[l] = idx;
        solve(ans,k,n,idx+1,l+1,r);

    }
}

signed main() {
    int t;
    cin >> t;
 
    while (t--) {

        int n,k;
        cin>>n>>k;

        if(n-1 < 60 && k> pow(2,n-1)) cout<<-1<<endl;
        else{
            vector<int>ans(n);

            solve(ans,k,n,1,0,n-1);
            for(auto ele:ans){
                cout<<ele<<" ";
            }
            cout<<endl;
        }

    }
 
    return 0;
}