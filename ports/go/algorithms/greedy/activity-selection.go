package greedy

import (
	"math"
	"sort"
)

type Interval struct{ Start, End float64 }

func ActivitySelection(intervals []Interval) []Interval {
	sorted := append([]Interval{}, intervals...)
	sort.SliceStable(sorted, func(i, j int) bool { return sorted[i].End < sorted[j].End })
	selected := []Interval{}
	lastEnd := math.Inf(-1)
	for _, interval := range sorted {
		if interval.Start < lastEnd {
			continue
		}
		selected = append(selected, interval)
		lastEnd = interval.End
	}
	return selected
}
func MergeIntervals(intervals []Interval) []Interval {
	sorted := append([]Interval{}, intervals...)
	sort.SliceStable(sorted, func(i, j int) bool { return sorted[i].Start < sorted[j].Start })
	result := []Interval{}
	for _, interval := range sorted {
		if len(result) > 0 && interval.Start <= result[len(result)-1].End {
			result[len(result)-1].End = max(result[len(result)-1].End, interval.End)
		} else {
			result = append(result, interval)
		}
	}
	return result
}
func MinMeetingRooms(intervals []Interval) int {
	type event struct {
		time  float64
		delta int
	}
	events := []event{}
	for _, i := range intervals {
		if i.Start < i.End {
			events = append(events, event{i.Start, 1}, event{i.End, -1})
		}
	}
	sort.Slice(events, func(i, j int) bool {
		if events[i].time == events[j].time {
			return events[i].delta < events[j].delta
		}
		return events[i].time < events[j].time
	})
	rooms, best := 0, 0
	for _, e := range events {
		rooms += e.delta
		best = max(best, rooms)
	}
	return best
}
