// This function checks for balanced brackets in a string

function checkForBalancedBrackets(str: string): boolean {
  // Use a stack to keep track of the brackets
  const stack: string[] = [];

  // Iterate through the string
  for (let i = 0; i < str.length; i++) {
    // Get the current character
    const char = str[i];

    // If the character is an opening bracket, push it to the stack
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    }
    // If the character is a closing bracket, check if it matches the top element of the stack
    else if (char === ')' || char === ']' || char === '}') {
      // If the top element doesn't match the closing bracket, return false
      if (stack.pop() !== char) {
        return false;
      }
    }
  }

  // If the stack is empty, all brackets are balanced
  return stack.length === 0;
}

// Test the function
console.log(checkForBalancedBrackets('(hello)[world]{!}')); // true
console.log(checkForBalancedBrackets('(hello)[world')); // false
console.log(checkForBalancedBrackets('(hello)[world]{!')); // false
