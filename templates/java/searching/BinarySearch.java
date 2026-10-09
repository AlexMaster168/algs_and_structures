public final class BinarySearch {
    public static int search(int[] values, int target) {
        int left = 0, right = values.length;
        while (left < right) {
            int middle = left + (right - left) / 2;
            if (values[middle] < target) left = middle + 1;
            else right = middle;
        }
        return left < values.length && values[left] == target ? left : -1;
    }
}
