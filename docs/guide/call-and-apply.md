# Call & Apply
In short, **call()** and **apply()** are methods that allow us to explicitly specify the scope that a function should run in.
Let's start with an example.

```js
var person1 = {
    name: 'Nicholas', age: 42
};
var person2 = {
    name: 'Dave', age: 34
};
var sayHello = function(){
    console.log('Hello, ' + this.name);
};
var sayGoodbye = function(){
    console.log('Goodbye, ' + this.name);
};
sayHello();
sayGoodbye();
```
In Javascript, scopes are dynamic and depend on the caller. The calls to **sayHello()** and **sayGoodbye()** will give unexpected values since they rely on their scope for the values of **this.name**. When called without an explicit scope, they run in the scope of the **Window Object**. 

This is where **call()** and **apply()** come to the rescue. **call()** and **apply()** allow us to execute a method, in the scope of the object passed to them as shown below

```js
sayHello.call(person1);
sayGoodbye.call(person2);

sayHello.apply(person1);
sayGoodbye.apply(person2);
```
The four calls above achieve the same thing. They execute the function in the scope of the argument supplied to it.

Consider what happens when the function takes multiple arguments. 

```js
var update = function(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
};
update.call(person1, 'Nicholas', 35, "Male");
```

No big deal. They're simply passed to the function as subsequent arguments. The problem with **call()** now becomes apparent. What do we do when we **do not know** the number of parameter that a function takes? 

This is where **apply()** comes in handy. The second argument to apply is an array that is unpacked into arguments and these are passsed to the function.  

```js
var update = function(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
};
update.apply(person1, ['Nicholas', 35, "Male"]);
```

## The Arguments Object 
**arguments** is an array-like object that is accessible inside functions, that contains the values of the arguments passed to the function.

We can illustrate this with an example
```js
function func1(a, b, c) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}
func1(1, 2, 3);
```
#### Output
    1
    2
    3
