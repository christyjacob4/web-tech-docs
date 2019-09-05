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
However the constructor property can be overwritten and hence it is always safer to use **instanceof** to check the type of an object.

So far we've seen really simple ocnstructors that simply instantiate an object. Let's look at more practical constructors.

```js
function Person(name) {
    this.name = name;
    this.sayName = function() {
        console.log(this.name);
    };
}
var person1 = new Person("Nicholas");
console.log(person1.name);
person1.sayName();
```
#### Output
    Nicholas
    Nicholas

The above constructor takes a parameter **name** and instantiates an object with the name. It also adds a method **sayName** to the object that allows the object to print the value of name.

## Accessor Functions
We can also have **accessor functions** to initialise an object in a consistent way using **Object.defineProperty()** inside the constructor. 

```js
function Person(name) {
    Object.defineProperty(this, "name", {
        get: function() {
            return name;
        },
        set: function(newName) {
            name = newName;
        },
        enumerable: true,
        configurable: true
    });
    this.sayName = function() {
        console.log(this.name);
    };
}
```
## Caveat #1
Make sure to always call constructors with **new** otherwise, you risk changing the global object instead of the newly created object.

```js
var person1 = Person("Nicholas"); // note: missing "new"
console.log(person1 instanceof Person); // False
console.log(typeof person1); // undefined
console.log(name);  // Nicholas
```
* When the person constructor is called without the new operator, the **this** inside the constructor refers to the global **this** object. 
* The variable person1 doesn't contain a value since it relies on **new** to supply a return value. Here Person() is just a function without a return value. 
* The assignment to **this.name** creates a new global variable called name which is where the name passed to person is stored.

## Constructor Issues
Constructors allow you to configure object instances with the same properties, but constructors alone don't eliminate code redundancy. In the above example, each instance has its own copy of the **sayName()** even though the functionality of **sayName()** doesn't change. So you would essentially be creating a 100 copies of **sayName()** if you had a 100 instances. It is desireable to have all the instances share a single copy of the **sayName()**. This is where prototypes come in!