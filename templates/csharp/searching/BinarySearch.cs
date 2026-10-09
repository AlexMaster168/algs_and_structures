public static class BinarySearch
{
    public static int Search(int[] values, int target)
    {
        int left = 0, right = values.Length;
        while (left < right)
        {
            int middle = left + (right - left) / 2;
            if (values[middle] < target) left = middle + 1;
            else right = middle;
        }
        return left < values.Length && values[left] == target ? left : -1;
    }
}
