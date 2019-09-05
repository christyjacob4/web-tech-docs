# Constructors
A Constructor is simply a function that is used with the new operator to create new objects. It is defined the same was as any other function. It is **syntactically identical** to any other function and the only difference is in the **naming convention**. A constructor function starts with a capital letter.

```js
function Person() {
    // some code here
}
```
Using this constructor we can now instantiate objects like shown
```js
var person1 = new Person();
var person2 = new Person();
```
If there are no parameters to be passed to a constructor, we can even write
```js
var person1 = new Person;
var person2 = new Person;
```
Even though the constructor doesn't explicitly return anything, **person1** and **person2** are instances of Person and this can be verified using the **instanceof** operator.

```js
console.log(person1 instanceof Person); // True
console.log(person2 instanceof Person); // True
```
The type of an object can also be determined by using it's inbuilt **constructor** property. 

#### For example 
```js
var obj = new Object() 
console.log(person1.constructor === Person); // true
console.log(obj.constructor === Object); // true
```
However the constructor property can br overwritten and hence it is always safer to use **instanceof** to check the type of an object.