# JS Objects 
An object is an **unordered list of properties** consisting of a name (always a string) and a value. When the value of a property is a function, it is called a method.
Javascript Objects can be thought of as hash tables


<div style="text-align:center;">
    <img src="/images/js-object.png" alt="Object Hash Table" height=400px width=500px/>
</div>

## Creating a JS Object 
The most common way to create a JS object is to use the **new**  operator with a constructor. A constructor is simply a function tha uses **new** to create an object. Any function can be used as a constructor. It is a general convention in JS for constructors to begin with a **Capital Letter** to distinguish them from ordinary funcitons .  

```javascript
var object = new Object();
```
## Difference between Primitives and Objects
Reference types do not store the object into the variable to which it is assigned instead it holds a pointer to a location in the memory where the object exists. This is the main difference between primitives and objects. Primitives are **stored directly in the variable**.

When you assign an object to another variable, you're essentially just assigning the pointer to  and each variable references the same object in memory.
```javascript
var object1 = new Object();
var object2 = object1;
```
This code creates a new object and places its memory location in **object1**. The assignment makes **object2** point to the same address in memory.

<div style="text-align:center;">
    <img src="/images/variable-memory.png" alt="Object Hash Table"/>
</div>

## Dereferencing Objects 
JS has a garbage collector that takes care of **deferencing** all the objects that have been created. However, it's a good practice to let the garbage colector know that you will no longer be using a variable by assigning it to **null**. 

```javascript
var object1 = new Object();
// do something
object1 = null;
// dereference
```

## Built-in Reference Types
Javascript provides several built in reference types that have built in methods for ease of use
* #### Array 
* #### Date 
* #### Error
* #### Function
* #### Object
* #### RegExp
  
Objects of the above mentioned reference types can also be instantiated using the **new** keyword.

```js
var items = new Array();
var now = new Date();
var error = new Error("Something bad happened.");
var func = new Function("console.log('Hi');");
var object = new Object();
var re = new RegExp("\\d+");
```

## Literal Forms
The literal notation allows us to create a reference type without using the **new** operator. 

The object is made of properties which are key-value pairs, where the key is an identifier(or a string) and the value can be any reference type. The properties of an object can be accessed using the **dot** notation as well as **index** notation. We can declare an object using the literal notation in the following way. 

```js
var shape = {
  name : "square",
  side : 10,
  calcArea : function(){
    return this.side*this.side;
  }
}
console.log(shape.calcArea())
```
#### Output
    100


#### The following are considered to be valid
```js
var shape = {
  1 : 3,
  name : "square"
}
console.log(shape[1])
console.log(shape.name)
```
#### Output
    3
    square
---


```js
var shape = {
  1 : 3,
  name : "square"
}
console.log(shape['1'])
console.log(shape['name'])
```
#### Output
    3
    square
---



```js
var shape = {
  "name" : "square"
}
console.log(shape.name)
```
#### Output
    square
---


#### However this produces an error
```js
var shape = {
  1 : "some value"
}
console.log(shape.1)
```
#### Output
::: danger
Uncaught SyntaxError: missing ) after argument list
:::

## Adding or removing properties
JS allows us to add properties to objects at any time

```js
var object1 = new Object();
object1.myCustomProperty = "Awesome!";
console.log(object1.myCustomProperty);
```
#### Output
    Awesome!
---
#### Similarly

```js
var shape = {
    name : "square", 
}
shape.num_sides = 4
shape.side_length = 10
shape.calcArea = function() {
    return this.size_length*this.side_length
}
console.log(shape.calcArea())
```
#### Output
    100

## Function Literals 
Functions can be defined using two methods as well. 
* #### Using the literal  Notation 
```js
function reflect(value) {
    return value;
}
```
* #### Using the constructor. 
However, it is discouraged to use the constructor notation due to **poor readability** and lack of **debugger support** as shown in the example.
```js
var reflect = new Function("value", "return value;");
```

## Identifying Reference types
In case of functions, we can check its type using the **typeof** operator. However, this method doesn't work for other reference types like arrays where it returns **object**.
```js
function reflect(value) {
    return value;
}
console.log(typeof reflect); // function
```

A better alternative is to use the **instanceof** operator which takes an object and a constructor to a reference type and returns true if the object is an instance of the constructor. The instace of operator can identify inherited types as well. This implies that every reference type is also an instance of **Object** as seen below.

```js
var items = [];
var object = {};
function reflect(value) {
return value;
}
console.log(items instanceof Array);    //  true
console.log(items instanceof Object);   //  true
console.log(object instanceof Object);  //  true
console.log(object instanceof Array);   //  false
console.log(reflect instanceof Function);   //  true
console.log(reflect instanceof Object);     //  true
```