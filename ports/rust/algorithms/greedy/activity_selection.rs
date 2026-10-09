#[derive(Clone, Copy)]
pub struct Interval {
    pub start: f64,
    pub end: f64,
}
pub fn activity_selection(intervals: &[Interval]) -> Vec<Interval> {
    let mut sorted = intervals.to_vec();
    sorted.sort_by(|a, b| a.end.total_cmp(&b.end));
    let mut end = f64::NEG_INFINITY;
    sorted
        .into_iter()
        .filter(|interval| {
            if interval.start < end {
                false
            } else {
                end = interval.end;
                true
            }
        })
        .collect()
}
pub fn merge_intervals(intervals: &[Interval]) -> Vec<Interval> {
    let mut sorted = intervals.to_vec();
    sorted.sort_by(|a, b| a.start.total_cmp(&b.start));
    let mut result: Vec<Interval> = Vec::new();
    for interval in sorted {
        if let Some(last) = result.last_mut() {
            if interval.start <= last.end {
                last.end = last.end.max(interval.end);
                continue;
            }
        }
        result.push(interval);
    }
    result
}
pub fn min_meeting_rooms(intervals: &[Interval]) -> usize {
    let mut events = Vec::new();
    for interval in intervals {
        assert!(interval.end >= interval.start);
        if interval.start < interval.end {
            events.push((interval.start, 1isize));
            events.push((interval.end, -1));
        }
    }
    events.sort_by(|a, b| a.0.total_cmp(&b.0).then(a.1.cmp(&b.1)));
    let (mut rooms, mut best) = (0, 0);
    for (_, delta) in events {
        rooms += delta;
        best = best.max(rooms);
    }
    best as usize
}
