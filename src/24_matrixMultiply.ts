function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error("The number of columns in matrix A must match the number of rows in matrix B.");
  }

  const result: number[][] = [];
  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}
