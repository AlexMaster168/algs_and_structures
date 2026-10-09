import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent


def run(command, cwd=ROOT):
    subprocess.run(command, cwd=cwd, check=True)


def check_python():
    sys.path.insert(0, str(ROOT / 'python'))
    from searching.binary_search import binary_search
    from sorting.merge_sort import merge_sort
    from data_structures.disjoint_set import DisjointSet
    for values in [[], [1], [3, -1, 3, 0], list(range(100, -1, -1))]:
        original = values.copy()
        ordered = merge_sort(values)
        assert ordered == sorted(values) and values == original
        for target in range(-2, 103):
            assert binary_search(ordered, target) == (ordered.index(target) if target in ordered else -1)
    d = DisjointSet(4)
    assert d.union(0, 1) and d.union(1, 2) and not d.union(2, 0)
    assert d.find(0) == d.find(2) and d.find(0) != d.find(3)


RUNNERS = {
    'javascript': ('node', 'check.mjs', '''
import assert from 'node:assert/strict';
import { binarySearch } from './searching/binary-search.mjs';
import { mergeSort } from './sorting/merge-sort.mjs';
import { DisjointSet } from './data-structures/disjoint-set.mjs';
for (const values of [[], [1], [3,-1,3,0], Array.from({length:101},(_,i)=>100-i)]) {
  const ordered = mergeSort(values);
  assert.deepEqual(ordered, [...values].sort((a,b)=>a-b));
  for (let target=-2;target<103;target++) assert.equal(binarySearch(ordered,target),ordered.indexOf(target));
}
const d = new DisjointSet(4);
assert(d.union(0,1) && d.union(1,2) && !d.union(2,0));
assert(d.find(0)===d.find(2) && d.find(0)!==d.find(3));
'''),
    'php': ('php', 'check.php', '''<?php
require __DIR__.'/searching/binary_search.php';
require __DIR__.'/sorting/merge_sort.php';
require __DIR__.'/data-structures/DisjointSet.php';
function verify(bool $ok): void { if (!$ok) throw new RuntimeException('Test failed'); }
foreach ([[],[1],[3,-1,3,0],range(100,0)] as $values) {
    $expected=$values; sort($expected); $ordered=mergeSort($values); verify($ordered===$expected);
    for ($target=-2;$target<103;$target++) {
        $index=array_search($target,$ordered,true);
        verify(binarySearch($ordered,$target)===($index===false?-1:$index));
    }
}
$d=new DisjointSet(4);
verify($d->union(0,1) && $d->union(1,2) && !$d->union(2,0));
verify($d->find(0)===$d->find(2) && $d->find(0)!==$d->find(3));
'''),
    'java': ('javac', 'Check.java', '''import java.util.Arrays;
public class Check {
    static void verify(boolean ok) { if (!ok) throw new AssertionError(); }
    public static void main(String[] args) {
        for (int[] values : new int[][] { {}, {1}, {3,-1,3,0}, {5,4,3,2,1} }) {
            int[] expected=values.clone(); Arrays.sort(expected);
            int[] ordered=MergeSort.sort(values); verify(Arrays.equals(expected,ordered));
            for (int target=-2;target<8;target++) {
                int index=-1;
                for (int i=0;i<ordered.length;i++) if (ordered[i]==target) { index=i; break; }
                verify(BinarySearch.search(ordered,target)==index);
            }
        }
        DisjointSet d=new DisjointSet(4);
        verify(d.union(0,1) && d.union(1,2) && !d.union(2,0));
        verify(d.find(0)==d.find(2) && d.find(0)!=d.find(3));
    }
}
'''),
    'csharp': ('dotnet', 'Program.cs', '''using System;
class Program {
    static void Verify(bool ok) { if (!ok) throw new Exception("Test failed"); }
    static void Main() {
        foreach (var values in new int[][] { Array.Empty<int>(), new[]{1}, new[]{3,-1,3,0}, new[]{5,4,3,2,1} }) {
            var expected=(int[])values.Clone(); Array.Sort(expected);
            var ordered=MergeSort.Sort(values);
            Verify(string.Join(",",expected)==string.Join(",",ordered));
            for (int target=-2;target<8;target++) Verify(BinarySearch.Search(ordered,target)==Array.IndexOf(ordered,target));
        }
        var d=new DisjointSet(4);
        Verify(d.Union(0,1) && d.Union(1,2) && !d.Union(2,0));
        Verify(d.Find(0)==d.Find(2) && d.Find(0)!=d.Find(3));
    }
}
'''),
    'cpp': ('g++', 'check.cpp', '''#include "searching/binary_search.hpp"
#include "sorting/merge_sort.hpp"
#include "data-structures/disjoint_set.hpp"
#include <algorithm>
#include <cassert>
int main() {
    for (auto values : std::vector<std::vector<int>>{{},{1},{3,-1,3,0},{5,4,3,2,1}}) {
        auto expected=values; std::sort(expected.begin(),expected.end());
        auto ordered=merge_sort(values); assert(ordered==expected);
        for (int target=-2;target<8;target++) {
            auto it=std::find(ordered.begin(),ordered.end(),target);
            assert(binary_search(ordered,target)==(it==ordered.end()?-1:it-ordered.begin()));
        }
    }
    DisjointSet d(4);
    assert(d.unite(0,1) && d.unite(1,2) && !d.unite(2,0));
    assert(d.find(0)==d.find(2) && d.find(0)!=d.find(3));
}
'''),
    'go': ('go', 'check_test.go', '''package templates
import (
 "testing"
 "reflect"
 "sort"
 "algorithms/templates/searching"
 "algorithms/templates/sorting"
 structures "algorithms/templates/data-structures"
)
func TestTemplates(t *testing.T) {
 for _, values := range [][]int{{},{1},{3,-1,3,0},{5,4,3,2,1}} {
  expected:=append([]int{},values...); sort.Ints(expected)
  ordered:=sorting.MergeSort(values)
  if !reflect.DeepEqual(expected,ordered) { t.Fatal(ordered) }
  for target:=-2;target<8;target++ {
   index:=-1; for i,v:=range ordered { if v==target { index=i; break } }
   if searching.BinarySearch(ordered,target)!=index { t.Fatal(target) }
  }
 }
 d:=structures.NewDisjointSet(4)
 if !d.Union(0,1) || !d.Union(1,2) || d.Union(2,0) || d.Find(0)!=d.Find(2) || d.Find(0)==d.Find(3) { t.Fatal("union") }
}
'''),
    'rust': ('rustc', 'check.rs', '''#[path="searching/binary_search.rs"] mod searching;
#[path="sorting/merge_sort.rs"] mod sorting;
#[path="data-structures/disjoint_set.rs"] mod structures;
fn main() {
 for values in [vec![],vec![1],vec![3,-1,3,0],vec![5,4,3,2,1]] {
  let mut expected=values.clone(); expected.sort();
  let ordered=sorting::merge_sort(&values); assert_eq!(ordered,expected);
  for target in -2..8 { assert_eq!(searching::binary_search(&ordered,target),ordered.iter().position(|&v|v==target)); }
 }
 let mut d=structures::DisjointSet::new(4);
 assert!(d.union(0,1) && d.union(1,2) && !d.union(2,0));
 assert_eq!(d.find(0),d.find(2)); assert_ne!(d.find(0),d.find(3));
}
'''),
}


def main():
    selected = sys.argv[1:] or ['python', *RUNNERS]
    for language in selected:
        if language == 'python':
            check_python()
        else:
            tool, filename, source = RUNNERS[language]
            if not shutil.which(tool):
                if sys.argv[1:]:
                    raise RuntimeError(f'{tool} is required')
                print(f'SKIP {language}: {tool} unavailable')
                continue
            scratch = ROOT.parent / 'dist' / 'template-checks'
            scratch.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(dir=scratch) as temporary:
                work = pathlib.Path(temporary)
                shutil.copytree(ROOT / language, work, dirs_exist_ok=True)
                (work / filename).write_text(source, encoding='utf-8')
                if language in ('php', 'javascript'):
                    run([tool, filename], work)
                elif language == 'java':
                    run(['javac', '-d', '.', *map(str, work.rglob('*.java'))], work)
                    run(['java', '-cp', '.', 'Check'], work)
                elif language == 'csharp':
                    major = subprocess.check_output(['dotnet', '--version'], text=True).split('.')[0]
                    (work / 'Check.csproj').write_text(f'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net{major}.0</TargetFramework></PropertyGroup></Project>')
                    run(['dotnet', 'run', '--project', 'Check.csproj'], work)
                elif language == 'go':
                    run(['go', 'test', './...'], work)
                else:
                    executable = str(work / 'check.exe')
                    command = ['g++', '-std=c++17', filename, '-o', executable] if language == 'cpp' else ['rustc', '--edition=2021', filename, '-o', executable]
                    run(command, work)
                    run([executable], work)
        print(f'PASS {language}')


if __name__ == '__main__':
    main()
