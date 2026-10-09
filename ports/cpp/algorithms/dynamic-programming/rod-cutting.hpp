#pragma once
#include "../../support.hpp"
namespace algs {
struct RodCuttingResult{double revenue;std::vector<int>pieces;};inline RodCuttingResult rodCutting(const Numbers&p,int length){Numbers revenue(length+1);std::vector<int>cut(length+1);for(int total=1;total<=length;++total)for(int piece=1;piece<=std::min(total,int(p.size()));++piece){double v=p[piece-1]+revenue[total-piece];if(v>revenue[total]){revenue[total]=v;cut[total]=piece;}}std::vector<int>pieces;for(int rest=length;rest>0&&cut[rest]>0;rest-=cut[rest])pieces.push_back(cut[rest]);return {revenue[length],pieces};}
}
