namespace Algorithms.BitManipulation;
public static class Bits
{
    public static int GetBit(uint value, int position) => (int)(value >> position & 1);
    public static uint SetBit(uint value, int position) => value | 1u << position;
    public static uint ClearBit(uint value, int position) => value & ~(1u << position);
    public static uint ToggleBit(uint value, int position) => value ^ 1u << position;
    public static int CountSetBits(uint value) { var count = 0; for (var v = value; v != 0; v &= v - 1) count++; return count; }
    public static bool IsPowerOfTwo(uint value) => value > 0 && (value & (value - 1)) == 0;
    public static int LowestSetBit(int value) => value & -value;
    public static int SingleNumber(IReadOnlyList<int> values) { var result = 0; foreach (var v in values) result ^= v; return result; }
    public static uint ReverseBits(uint value) { uint result = 0; for (var i = 0; i < 32; i++) { result = result << 1 | value & 1; value >>= 1; } return result; }
    public static int[] GrayCode(int bits) => Enumerable.Range(0, 1 << bits).Select(i => i ^ i >> 1).ToArray();
    public static T[][] SubsetsByMask<T>(IReadOnlyList<T> items) => Enumerable.Range(0, 1 << items.Count).Select(mask => items.Where((_, i) => (mask & 1 << i) != 0).ToArray()).ToArray();
    public static (int, int) SwapWithoutTemp(int a, int b) { a ^= b; b ^= a; a ^= b; return (a, b); }
    public static int HammingDistance(uint a, uint b) => CountSetBits(a ^ b);
}
