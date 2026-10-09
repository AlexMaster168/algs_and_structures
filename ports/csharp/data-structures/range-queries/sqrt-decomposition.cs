namespace Algorithms.DataStructures.RangeQueries;
public class SqrtDecomposition
{
    private readonly double[] values, blockSums; private readonly int blockSize;
    public SqrtDecomposition(IReadOnlyList<double> values) { this.values = values.ToArray(); blockSize = Math.Max(1, (int)Math.Ceiling(Math.Sqrt(values.Count))); blockSums = new double[(values.Count + blockSize - 1) / blockSize]; for (var i = 0; i < values.Count; i++) blockSums[i / blockSize] += values[i]; }
    public void Update(int index, double value) { blockSums[index / blockSize] += value - values[index]; values[index] = value; }
    public double RangeSum(int left, int right) { var sum = 0d; var i = left; while (i <= right && i % blockSize != 0) sum += values[i++]; while (i + blockSize - 1 <= right) { sum += blockSums[i / blockSize]; i += blockSize; } while (i <= right) sum += values[i++]; return sum; }
}
