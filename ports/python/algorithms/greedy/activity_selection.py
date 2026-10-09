def activity_selection(intervals):
    selected, last_end = [], float('-inf')
    for interval in sorted(intervals, key=lambda item: item['end']):
        if interval['start'] >= last_end:
            selected.append(interval)
            last_end = interval['end']
    return selected


def merge_intervals(intervals):
    merged = []
    for interval in sorted(intervals, key=lambda item: item['start']):
        start, end = interval['start'], interval['end']
        if merged and start <= merged[-1]['end']:
            merged[-1]['end'] = max(merged[-1]['end'], end)
        else:
            merged.append({'start': start, 'end': end})
    return merged


def min_meeting_rooms(intervals):
    starts = sorted(item['start'] for item in intervals if item['start'] < item['end'])
    ends = sorted(item['end'] for item in intervals if item['start'] < item['end'])
    rooms = best = end = 0
    for start in starts:
        while end < len(ends) and ends[end] <= start:
            rooms -= 1
            end += 1
        rooms += 1
        best = max(best, rooms)
    return best
