#pragma once
#include "../../support.hpp"
namespace algs {
inline Matrix floodFill(Matrix image,int row,int col,double color){if(row<0||row>=int(image.size())||col<0||col>=int(image[row].size()))return image;double original=image[row][col];if(original==color)return image;std::vector<std::pair<int,int>>stack{{row,col}};while(!stack.empty()){auto [r,c]=stack.back();stack.pop_back();if(r<0||r>=int(image.size())||c<0||c>=int(image[r].size())||image[r][c]!=original)continue;image[r][c]=color;stack.insert(stack.end(),{{r+1,c},{r-1,c},{r,c+1},{r,c-1}});}return image;}
}
