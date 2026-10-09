public static class MergeSort
{
    public static int[] Sort(int[] values)
    {
        if (values.Length < 2) return (int[])values.Clone();
        int middle = values.Length / 2;
        int[] left = Sort(values[..middle]);
        int[] right = Sort(values[middle..]);
        int[] result = new int[values.Length];
        int i = 0, j = 0, k = 0;
        while (i < left.Length && j < right.Length)
            result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.Length) result[k++] = left[i++];
        while (j < right.Length) result[k++] = right[j++];
        return result;
    }
}
