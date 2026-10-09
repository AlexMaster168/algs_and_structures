package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Index {
public static final Map<String,BiFunction<List<Integer>,Comparator<Integer>,List<Integer>>> sorts=Map.ofEntries(Map.entry("bubbleSort",BubbleSort::bubbleSort),Map.entry("cocktailShakerSort",CocktailShakerSort::cocktailShakerSort),Map.entry("heapSort",HeapSort::heapSort),Map.entry("insertionSort",InsertionSort::insertionSort),Map.entry("mergeSort",MergeSort::mergeSort),Map.entry("bottomUpMergeSort",MergeSort::bottomUpMergeSort),Map.entry("quickSort",QuickSort::quickSort),Map.entry("quickSortFunctional",QuickSort::quickSortFunctional),Map.entry("selectionSort",SelectionSort::selectionSort),Map.entry("shellSort",ShellSort::shellSort),Map.entry("timSort",TimSort::timSort));
}
