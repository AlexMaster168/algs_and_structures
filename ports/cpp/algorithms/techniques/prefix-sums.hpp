#pragma once
#include "../../support.hpp"
namespace algs {
class PrefixSums{Numbers p{0};public:explicit PrefixSums(const Numbers&a){for(double v:a)p.push_back(p.back()+v);}double sum(int l,int r)const{return p.at(r+1)-p.at(l);}};
class PrefixSums2D{Matrix p;public:explicit PrefixSums2D(const Matrix&a):p(a.size()+1,Numbers(a.empty()?1:a[0].size()+1)){for(int r=0;r<int(a.size());++r)for(int c=0;c<int(a[r].size());++c)p[r+1][c+1]=a[r][c]+p[r][c+1]+p[r+1][c]-p[r][c];}double sum(int t,int l,int b,int r)const{return p[b+1][r+1]-p[t][r+1]-p[b+1][l]+p[t][l];}};
inline double subarraySumEquals(const Numbers&a,double target){std::map<double,double>seen{{0,1}};double sum=0,count=0;for(double v:a){sum+=v;count+=seen[sum-target];++seen[sum];}return count;}
inline Numbers differenceArrayApply(int length,const std::vector<std::tuple<int,int,double>>&updates){Numbers d(length+1),r;for(auto [l,h,v]:updates){d.at(l)+=v;d.at(h+1)-=v;}double running=0;for(int i=0;i<length;++i){running+=d[i];r.push_back(running);}return r;}
inline std::optional<double>majorityElement(const Numbers&a){std::optional<double>candidate;int count=0;for(double v:a){if(count==0)candidate=v;count+=v==candidate?1:-1;}if(candidate&&std::count(a.begin(),a.end(),*candidate)>int(a.size())/2)return candidate;return {};}
}
