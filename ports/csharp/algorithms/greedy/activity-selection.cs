namespace Algorithms.Greedy;

public record Interval(double Start, double End);
public static partial class Greedy
{
    public static I[] ActivitySelection<I>(IReadOnlyList<I> intervals) where I : Interval
    {
        var selected = new List<I>(); var lastEnd = double.NegativeInfinity;
        foreach (var interval in intervals.OrderBy(i => i.End)) { if (interval.Start < lastEnd) continue; selected.Add(interval); lastEnd = interval.End; } return selected.ToArray();
    }
    public static Interval[] MergeIntervals(IReadOnlyList<Interval> intervals)
    {
        var merged = new List<Interval>(); foreach (var interval in intervals.OrderBy(i => i.Start))
        {
            if (merged.Count > 0 && interval.Start <= merged[^1].End) merged[^1] = merged[^1] with { End = Math.Max(merged[^1].End, interval.End) };
            else merged.Add(interval with { });
        }
        return merged.ToArray();
    }
    public static int MinMeetingRooms(IReadOnlyList<Interval> intervals)
    {
        var events = intervals.Where(i => i.Start < i.End).SelectMany(i => new[] { (Time: i.Start, Delta: 1), (Time: i.End, Delta: -1) }).OrderBy(e => e.Time).ThenBy(e => e.Delta);
        int rooms = 0, best = 0; foreach (var item in events) { rooms += item.Delta; best = Math.Max(best, rooms); } return best;
    }
}
