namespace Algorithms.Sorting;
public static partial class Sort
{
    public static IReadOnlyList<string> ExportedAlgorithms { get; } = new[] { nameof(BubbleSort), nameof(BucketSort), nameof(CocktailShakerSort), nameof(CountingSort), nameof(HeapSort), nameof(InsertionSort), nameof(BottomUpMergeSort), nameof(MergeSort), nameof(QuickSort), nameof(QuickSortFunctional), nameof(RadixSort), nameof(SelectionSort), nameof(ShellSort), nameof(TimSort) };
}
