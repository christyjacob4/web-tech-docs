# Prototypes
Prototype is a property that is present in almost every function. The prototype is shared among all the object instances and those instances can access the properties of the prototype. For eg : The 
**hasOwnProperty()** is defined on the generic Object prototype but it can be accessed from any object as if it were an own property as shown.

```js
var book = {
    title: "The Principles of Object-Oriented JavaScript"
};
console.log("title" in book); // True 
console.log(book.hasOwnProperty("title")); // True
console.log("hasOwnProperty" in book); // True
console.log(book.hasOwnProperty("hasOwnProperty")); // True
console.log(Object.prototype.hasOwnProperty("hasOwnProperty")); // True
```
Even though there is no definition of **hasOwnProperty()** in book, it can be still be accessed since it is a part of **Object.prototype**. 

**The in operator returns true for both prototype properties as well as own properties.**

## Caveat #2
If a property is **in** an object but **hasOwnProperty()** returns **false** then the property is on the prototype.

```js
function hasPrototypeProperty(object, name) {
    return name in object && !object.hasOwnProperty(name);
}
console.log(hasPrototypeProperty(book, "title")); // False
console.log(hasPrototypeProperty(book, "hasOwnProperty")); // True
```

## The [[Prototype]] Property
An instance keeps track of its prototype through an internal property called **[[Prototype]]**. This property is a pointer back to the prototype object that the instance is using. When a new object is created, the constructor's prototype property is assigned to its **[[Prototype]]** property.  

<div style="text-align:center; margin : 50px">
    <img src="/images/prototype.png" alt="Object Hash Table" height=400px width=700px/>
</div>

The value of the **[[Prototype]]** property can be read using the **Object.getPrototypeOf()** method on an object. 
```js
var object = {};
var prototype = Object.getPrototypeOf(object);
console.log(prototype === Object.prototype); // True
```
For generic objects, **[[Prototype]]** is always a reference to **Object.prototype**.

To test if one object is a prototype for another, we can use the **isPrototypeOf()** method

```js
var object = {};
console.log(Object.prototype.isPrototypeOf(object)); // True
```
## Resolving a property
When a property is read on an object, the JavaScript engine first
looks for an **own property** with that name. If the engine finds a correctly
named own property, it returns that value. If no **own property** with that
name exists on the target object, JavaScript searches the **[[Prototype]]**
object instead. If a prototype property with that name exists, the value
of that property is returned. If the search concludes without finding a
property with the correct name, **undefined** is returned.

Consider the following example
```js
var object = {};
console.log(object.toString()); // "[object Object]"

object.toString = function() {
    return "[object Custom]";
};
console.log(object.toString()); // "[object Custom]"

// delete own property
delete object.toString;

console.log(object.toString()); // "[object Object]"

// no effect - delete only works on own properties
delete object.toString;
console.log(object.toString());
// "[object Object]"

```