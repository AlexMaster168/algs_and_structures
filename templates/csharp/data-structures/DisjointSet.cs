using System;

public sealed class DisjointSet
{
    private readonly int[] parent;
    private readonly int[] sizes;

    public DisjointSet(int size)
    {
        if (size < 0) throw new ArgumentOutOfRangeException(nameof(size));
        parent = new int[size];
        sizes = new int[size];
        for (int i = 0; i < size; i++) { parent[i] = i; sizes[i] = 1; }
    }

    public int Find(int value)
    {
        if (value < 0 || value >= parent.Length) throw new ArgumentOutOfRangeException(nameof(value));
        while (value != parent[value])
        {
            parent[value] = parent[parent[value]];
            value = parent[value];
        }
        return value;
    }

    public bool Union(int a, int b)
    {
        a = Find(a);
        b = Find(b);
        if (a == b) return false;
        if (sizes[a] < sizes[b]) (a, b) = (b, a);
        parent[b] = a;
        sizes[a] += sizes[b];
        return true;
    }
}
