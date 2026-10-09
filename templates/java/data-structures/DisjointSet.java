public final class DisjointSet {
    private final int[] parent;
    private final int[] sizes;

    public DisjointSet(int size) {
        if (size < 0) throw new IllegalArgumentException("Invalid size");
        parent = new int[size];
        sizes = new int[size];
        for (int i = 0; i < size; i++) {
            parent[i] = i;
            sizes[i] = 1;
        }
    }

    public int find(int value) {
        if (value < 0 || value >= parent.length) throw new IndexOutOfBoundsException();
        while (value != parent[value]) {
            parent[value] = parent[parent[value]];
            value = parent[value];
        }
        return value;
    }

    public boolean union(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        if (sizes[a] < sizes[b]) {
            int temporary = a;
            a = b;
            b = temporary;
        }
        parent[b] = a;
        sizes[a] += sizes[b];
        return true;
    }
}
