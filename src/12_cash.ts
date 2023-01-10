function cashFunction<T extends (...args: any[]) => any>(fn: T): T {
  const cash: { [key: string]: any } = {};
  return function (n: Parameters<T>) {
    if (cash[n]) {
      console.log("Взято из кеша", cash[n]);
      return cash[n];
    }
    let result = fn(n);
    console.log("Посчитала функция = ", result);
    cash[n] = result;
    return result;
  } as T;
}

function factorial(n: number): number {
  let result = 1;
  while (n != 1) {
    result *= n;
    n -= 1;
  }
  return result;
}

const cashFactorial = cashFunction(factorial);

cashFactorial(5);
cashFactorial(4);
cashFactorial(3);
cashFactorial(4);
cashFactorial(5);
cashFactorial(1);
