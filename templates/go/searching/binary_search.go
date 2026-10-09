package searching

func BinarySearch(values []int, target int) int {
	left, right := 0, len(values)
	for left < right {
		middle := left + (right-left)/2
		if values[middle] < target { left = middle+1 } else { right = middle }
	}
	if left < len(values) && values[left] == target { return left }
	return -1
}
