package sorting

func MergeSort(values []int) []int {
	if len(values) < 2 { return append([]int{}, values...) }
	middle := len(values)/2
	left, right := MergeSort(values[:middle]), MergeSort(values[middle:])
	result := make([]int, 0, len(values))
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] { result = append(result, left[i]); i++ } else { result = append(result, right[j]); j++ }
	}
	result = append(result, left[i:]...)
	return append(result, right[j:]...)
}
