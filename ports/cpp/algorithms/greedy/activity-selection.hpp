#pragma once
#include "../../support.hpp"
namespace algs {
struct Interval { double start, end; };
template<class I> std::vector<I> activitySelection(std::vector<I> intervals) { std::stable_sort(intervals.begin(), intervals.end(), [](const I& a, const I& b) { return a.end < b.end; }); std::vector<I> selected; double lastEnd = -infinity; for (const auto& interval : intervals) { if (interval.start < lastEnd) continue; selected.push_back(interval); lastEnd = interval.end; } return selected; }
inline std::vector<Interval> mergeIntervals(std::vector<Interval> intervals) { std::stable_sort(intervals.begin(), intervals.end(), [](auto a, auto b) { return a.start < b.start; }); std::vector<Interval> result; for (auto item : intervals) { if (!result.empty() && item.start <= result.back().end) result.back().end = std::max(result.back().end, item.end); else result.push_back(item); } return result; }
inline int minMeetingRooms(const std::vector<Interval>& intervals) { Numbers starts, ends; for (auto item : intervals) { if (item.end < item.start) throw std::invalid_argument("Invalid interval"); if (item.end == item.start) continue; starts.push_back(item.start); ends.push_back(item.end); } std::sort(starts.begin(), starts.end()); std::sort(ends.begin(), ends.end()); int rooms = 0, result = 0; std::size_t s = 0, e = 0; while (s < starts.size()) { if (starts[s] < ends[e]) { ++rooms; ++s; result = std::max(result, rooms); } else { --rooms; ++e; } } return result; }
}
