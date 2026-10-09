import java.util.Arrays;

public final class MergeSort {
    public static int[] sort(int[] values) {
        if (values.length < 2) return values.clone();
        int middle = values.length / 2;
        int[] left = sort(Arrays.copyOfRange(values, 0, middle));
        int[] right = sort(Arrays.copyOfRange(values, middle, values.length));
        int[] result = new int[values.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
}
