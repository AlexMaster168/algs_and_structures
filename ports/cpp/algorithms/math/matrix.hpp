#pragma once
#include "../../support.hpp"
namespace algs {
inline Matrix identity(int n){Matrix r(n,Numbers(n));for(int i=0;i<n;++i)r[i][i]=1;return r;}
inline Matrix multiply(const Matrix&a,const Matrix&b){int rows=int(a.size()),inner=int(b.size()),cols=b.empty()?0:int(b[0].size());if((a.empty()?0:int(a[0].size()))!=inner)throw std::out_of_range("Columns of A must match rows of B");Matrix r(rows,Numbers(cols));for(int i=0;i<rows;++i)for(int k=0;k<inner;++k)if(a[i][k]!=0)for(int j=0;j<cols;++j)r[i][j]+=a[i][k]*b[k][j];return r;}
inline Matrix transpose(const Matrix&a){Matrix r(a.empty()?0:a[0].size(),Numbers(a.size()));for(int i=0;i<int(a.size());++i)for(int j=0;j<int(r.size());++j)r[j][i]=a[i][j];return r;}
inline Matrix matrixPower(Matrix base,int e){auto r=identity(int(base.size()));while(e>0){if(e&1)r=multiply(r,base);base=multiply(base,base);e/=2;}return r;}
inline double determinant(Matrix m){int n=int(m.size());double det=1;for(int c=0;c<n;++c){int p=c;for(int r=c+1;r<n;++r)if(std::abs(m[r][c])>std::abs(m[p][c]))p=r;if(std::abs(m[p][c])<1e-12)return 0;if(p!=c){std::swap(m[p],m[c]);det=-det;}det*=m[c][c];for(int r=c+1;r<n;++r){double f=m[r][c]/m[c][c];for(int k=c;k<n;++k)m[r][k]-=f*m[c][k];}}return det;}
inline std::optional<Numbers>solveLinearSystem(Matrix m,const Numbers&b){int n=int(m.size());for(int i=0;i<n;++i)m[i].push_back(b[i]);for(int c=0;c<n;++c){int p=c;for(int r=c+1;r<n;++r)if(std::abs(m[r][c])>std::abs(m[p][c]))p=r;if(std::abs(m[p][c])<1e-12)return {};std::swap(m[p],m[c]);for(int r=0;r<n;++r){if(r==c)continue;double f=m[r][c]/m[c][c];for(int k=c;k<=n;++k)m[r][k]-=f*m[c][k];}}Numbers r;for(int i=0;i<n;++i)r.push_back(m[i][n]/m[i][i]);return r;}
}
