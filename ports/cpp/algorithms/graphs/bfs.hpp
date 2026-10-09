#pragma once
#include "../../support.hpp"
#include "types.hpp"
namespace algs {
struct BfsResult{std::vector<int>order,distance,parent;};inline BfsResult bfs(const AdjacencyList&g,int start){BfsResult r{{},std::vector<int>(g.size(),-1),std::vector<int>(g.size(),-1)};std::vector<int>q{start};r.distance.at(start)=0;for(int head=0;head<int(q.size());++head){int v=q[head];r.order.push_back(v);for(int n:g[v])if(r.distance[n]==-1){r.distance[n]=r.distance[v]+1;r.parent[n]=v;q.push_back(n);}}return r;}inline std::optional<std::vector<int>>shortestPathUnweighted(const AdjacencyList&g,int s,int t){auto r=bfs(g,s);if(r.distance[t]==-1)return {};return reconstructPath(r.parent,t);}
inline int gridShortestPath(const std::vector<std::string>&g,std::pair<int,int>s,std::pair<int,int>t,char wall='#'){int rows=int(g.size()),cols=rows?int(g[0].size()):0;std::vector<std::vector<int>>d(rows,std::vector<int>(cols,-1));std::vector<std::pair<int,int>>q{s};d.at(s.first).at(s.second)=0;for(int h=0;h<int(q.size());++h){auto [r,c]=q[h];if(q[h]==t)return d[r][c];for(auto [dr,dc]:std::vector<std::pair<int,int>>{{1,0},{-1,0},{0,1},{0,-1}}){int nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr>=rows||nc>=cols||g[nr][nc]==wall||d[nr][nc]!=-1)continue;d[nr][nc]=d[r][c]+1;q.emplace_back(nr,nc);}}return -1;}
}
