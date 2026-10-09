package algorithms.greedy;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class ActivitySelection {
public interface Interval{double start();double end();}public record TimeInterval(double start,double end) implements Interval{}public static <I extends Interval> List<I> activitySelection(List<I> intervals){List<I> o=new ArrayList<>();double end=Double.NEGATIVE_INFINITY;for(I i:algorithms.sorting.MergeSort.mergeSort(intervals,Comparator.comparingDouble(Interval::end)))if(i.start()>=end){o.add(i);end=i.end();}return o;}public static List<TimeInterval> mergeIntervals(List<? extends Interval> intervals){List<Interval> a=new ArrayList<>(intervals);List<TimeInterval> o=new ArrayList<>();for(Interval i:algorithms.sorting.MergeSort.mergeSort(a,Comparator.comparingDouble(Interval::start))){if(!o.isEmpty()&&i.start()<=o.get(o.size()-1).end){TimeInterval last=o.remove(o.size()-1);o.add(new TimeInterval(last.start,Math.max(last.end,i.end())));}else o.add(new TimeInterval(i.start(),i.end()));}return o;}public static int minMeetingRooms(List<? extends Interval> intervals){List<Double> starts=new ArrayList<>(),ends=new ArrayList<>();for(Interval i:intervals){starts.add(i.start());ends.add(i.end());}starts=algorithms.sorting.MergeSort.mergeSort(starts);ends=algorithms.sorting.MergeSort.mergeSort(ends);int rooms=0,max=0;for(int s=0,e=0;s<starts.size();){if(e>=ends.size()||starts.get(s)<ends.get(e)){rooms++;s++;}else{rooms--;e++;}max=Math.max(max,rooms);}return max;}
}
