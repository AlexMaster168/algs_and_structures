#pragma once
#include "../../support.hpp"
namespace algs {
class DisjointSet{std::vector<int>parent,sizes;int sets;public:explicit DisjointSet(int size):parent(size),sizes(size,1),sets(size){std::iota(parent.begin(),parent.end(),0);}int count()const{return sets;}int find(int x){int root=x;while(parent.at(root)!=root)root=parent[root];while(parent[x]!=root){int next=parent[x];parent[x]=root;x=next;}return root;}bool unite(int a,int b){a=find(a);b=find(b);if(a==b)return false;if(sizes[a]<sizes[b])std::swap(a,b);parent[b]=a;sizes[a]+=sizes[b];--sets;return true;}bool connected(int a,int b){return find(a)==find(b);}int sizeOf(int x){return sizes[find(x)];}};
}
