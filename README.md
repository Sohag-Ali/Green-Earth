## Project Live Link : 



#### 1) What is the difference between var, let, and const?

1. var : Function-scoped, can be redeclared, and hoisted (initialized with undefined).

2. let : Block-scoped, cannot be redeclared in the same scope, hoisted but not initialized (Temporal Dead Zone).

3. const : Block-scoped, must be initialized at declaration, and value cannot be reassigned (but objects/arrays can be mutated).

#### 2) What is the difference between map(), forEach(), and filter()? 

1. forEach() : Loops through an array, executes a callback for each element, returns undefined.

2. map() : Loops through an array, executes a callback, returns a new array with transformed values.

3. filter() : Loops through an array, executes a condition, returns a new array with only the elements that pass the condition.

#### 3) What are arrow functions in ES6?

Arrow functions are a shorter syntax for writing functions introduced in ES6.

They do not have their own this, instead they inherit this from the surrounding scope.

**Example:** 
const add = (a, b) => a + b;


#### 4) How does destructuring assignment work in ES6?

Destructuring lets you extract values from arrays or properties from objects into distinct variables.

**Example:** 
const person = { name: "Sohag", age: 22 };
const { name, age } = person; 
console.log(name, age); // Sohag 22


#### 5) Explain template literals in ES6. How are they different from string concatenation?

Template literals use backticks (`) and allow embedding expressions with ${}.

They support multi-line strings and dynamic interpolation, unlike + string concatenation.

**Example:**
const name = "Sohag";
console.log(`Hello, ${name}! Welcome to ES6.`); 



🌴 My Project API Endpoints :
---
1. Get 🌴All Plants
```bash
https://openapi.programming-hero.com/api/plants
```

2. Get 🌴All categories <br/>
```bash
https://openapi.programming-hero.com/api/categories
```


3. Get 🌴plants by categories <br/>
```bash
https://openapi.programming-hero.com/api/category/${id}
```

```bash
https://openapi.programming-hero.com/api/category/1
```

4. Get 🌴Plants Detail <br/>

```bash
https://openapi.programming-hero.com/api/plant/${id}
```

```bash
https://openapi.programming-hero.com/api/plant/1
```
---
🧰 Technology Stack:
        
        HTML

        CSS (Tailwind / DaisyUI)

        JavaScript (Vanilla only, no frameworks)

