#pragma once
#include <algorithm>
#include <cstdint>
#include <ostream>
#include <stdexcept>
#include <string>
#include <vector>
namespace algs {
class BigInt {
    std::vector<int> digits{0};
    bool negative=false;
    void normalize(){while(digits.size()>1&&digits.back()==0)digits.pop_back();if(digits.size()==1&&digits[0]==0)negative=false;}
    static int magnitude(const BigInt&a,const BigInt&b){if(a.digits.size()!=b.digits.size())return a.digits.size()<b.digits.size()?-1:1;for(int i=int(a.digits.size())-1;i>=0;--i)if(a.digits[i]!=b.digits[i])return a.digits[i]<b.digits[i]?-1:1;return 0;}
    static BigInt add(const BigInt&a,const BigInt&b){BigInt r;r.digits.clear();int carry=0;for(std::size_t i=0;i<std::max(a.digits.size(),b.digits.size())||carry;++i){int v=carry+(i<a.digits.size()?a.digits[i]:0)+(i<b.digits.size()?b.digits[i]:0);r.digits.push_back(v%10);carry=v/10;}r.normalize();return r;}
    static BigInt subtract(const BigInt&a,const BigInt&b){BigInt r=a;int borrow=0;for(std::size_t i=0;i<r.digits.size();++i){int v=r.digits[i]-borrow-(i<b.digits.size()?b.digits[i]:0);borrow=v<0;r.digits[i]=v+10*borrow;}r.normalize();return r;}
public:
    BigInt(std::int64_t value=0){negative=value<0;std::uint64_t v=negative?std::uint64_t(-(value+1))+1:std::uint64_t(value);digits.clear();do{digits.push_back(int(v%10));v/=10;}while(v);}
    explicit BigInt(const std::string&s){digits.clear();std::size_t start=!s.empty()&&s[0]=='-'?1:0;negative=start!=0;for(std::size_t i=s.size();i>start;--i){if(s[i-1]<'0'||s[i-1]>'9')throw std::invalid_argument("Invalid integer");digits.push_back(s[i-1]-'0');}if(digits.empty())digits.push_back(0);normalize();}
    std::string str()const{std::string r=negative?"-":"";for(auto i=digits.rbegin();i!=digits.rend();++i)r+=char('0'+*i);return r;}
    friend std::ostream&operator<<(std::ostream&out,const BigInt&v){return out<<v.str();}
    friend bool operator==(const BigInt&a,const BigInt&b){return a.negative==b.negative&&a.digits==b.digits;}
    friend bool operator!=(const BigInt&a,const BigInt&b){return !(a==b);}
    friend bool operator<(const BigInt&a,const BigInt&b){if(a.negative!=b.negative)return a.negative;int c=magnitude(a,b);return a.negative?c>0:c<0;}
    friend bool operator>(const BigInt&a,const BigInt&b){return b<a;}
    friend bool operator<=(const BigInt&a,const BigInt&b){return !(b<a);}
    friend bool operator>=(const BigInt&a,const BigInt&b){return !(a<b);}
    BigInt operator-()const{BigInt r=*this;if(r!=0)r.negative=!r.negative;return r;}
    friend BigInt operator+(const BigInt&a,const BigInt&b){BigInt r;if(a.negative==b.negative){r=add(a,b);r.negative=a.negative;}else if(magnitude(a,b)>=0){r=subtract(a,b);r.negative=a.negative;}else{r=subtract(b,a);r.negative=b.negative;}r.normalize();return r;}
    friend BigInt operator-(const BigInt&a,const BigInt&b){return a+(-b);}
    friend BigInt operator*(const BigInt&a,const BigInt&b){BigInt r;r.digits.assign(a.digits.size()+b.digits.size()+1,0);for(std::size_t i=0;i<a.digits.size();++i){int carry=0;for(std::size_t j=0;j<b.digits.size()||carry;++j){int v=r.digits[i+j]+carry+(j<b.digits.size()?a.digits[i]*b.digits[j]:0);r.digits[i+j]=v%10;carry=v/10;}}r.negative=a.negative!=b.negative;r.normalize();return r;}
    static std::pair<BigInt,BigInt>divmod(const BigInt&a,const BigInt&b){if(b==0)throw std::domain_error("Division by zero");BigInt divisor=b;divisor.negative=false;BigInt q,rem;q.digits.assign(a.digits.size(),0);for(int i=int(a.digits.size())-1;i>=0;--i){rem=rem*10+a.digits[i];int digit=0;while(rem>=divisor){rem=subtract(rem,divisor);++digit;}q.digits[i]=digit;}q.negative=a.negative!=b.negative;rem.negative=a.negative;q.normalize();rem.normalize();return {q,rem};}
    friend BigInt operator/(const BigInt&a,const BigInt&b){return divmod(a,b).first;}
    friend BigInt operator%(const BigInt&a,const BigInt&b){return divmod(a,b).second;}
    BigInt&operator+=(const BigInt&v){return *this=*this+v;}
    BigInt&operator-=(const BigInt&v){return *this=*this-v;}
    BigInt&operator*=(const BigInt&v){return *this=*this*v;}
    BigInt&operator%=(const BigInt&v){return *this=*this%v;}
    BigInt&operator++(){return *this+=1;}
    friend BigInt operator>>(BigInt a,int bits){for(int i=0;i<bits;++i)a=a/2;return a;}
    BigInt&operator>>=(int bits){return *this=*this>>bits;}
    friend int operator&(const BigInt&a,int mask){BigInt r=a%2;return (r==0?0:1)&mask;}
};
}
