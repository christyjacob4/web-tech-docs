# Prototypes
Prototype is a property that is present in almost every function. The prototype is shared among all the object instances and all those instances can access the properties of the prototype. For eg, The 
**hasOwnProperty()** method is defined on the generic Object prototype but it can be accessed from any object as if it were an own property as shown.

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
An instance keeps track of its prototype through an internal property called **[[Prototype]]**. This property is a pointer back to the prototype object that the instance is using. When a new object is created using **new**, the constructor's prototype property is assigned to the object's **[[Prototype]]** property.  

<div style="text-align:center">
    <img src="/images/prototype.png" alt="Object Hash Table"/>
</div>

The value of the **[[Prototype]]** property can be read using the **Object.getPrototypeOf()** method on an object. 
```js
var object = {};
var prototype = Object.getPrototypeOf(object);
console.log(prototype === Object.prototype); // True
```
For generic objects, **[[Prototype]]** is always a reference to **Object.prototype**.

Some JavaScript engines also support a property called **\_\_proto\_\_** on all objects. This property allows us to both read from and write to the **[[Prototype]]** property.

:::tip NOTE
**\_\_proto\_\_** or **[[Prototype]]** is a property of an instance whereas **.prototype** is a property of a function.
:::

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
// Case 1
console.log(object.toString()); // "[object Object]"

object.toString = function() {
    return "[object Custom]";
};
// Case 2
console.log(object.toString()); // "[object Custom]"

// delete own property
delete object.toString;
// Case 3
console.log(object.toString()); // "[object Object]"

// no effect - delete only works on own properties
delete object.toString;
console.log(object.toString()); // "[object Object]"
```
* In the first case, the **toString()** method comes from the prototype
* In the second case, the **toString()** method of the object **shadows** the **toString()** method from the prototype.
* In the third case, we delete **own property** of the object. It is **not possible** to delete a prototype property from an instance, because delete operator acts only on  own properties. 

This can be better understood thorugh the diagram below

<div style="text-align:center;">
    <img src="/images/prototype-properties.png" alt="Object Hash Table"/>
</div>

## Caveat #3
You **cannot assign** a value to a prototype property from an instance! 

## Prototypes in Constructors
Since prototypes are shared by all instances of a reference type, it is much more **efficient** to put the methods in the prototype and use the **this** keyword within the method to access the properties of the current instance.

```js
function Person(name) {
    this.name = name;
}

Person.prototype.sayName = function() {
    console.log(this.name);
};

var person1 = new Person("Nicholas");
var person2 = new Person("Greg");

console.log(person1.name); // Nicholas
console.log(person2.name);  // Greg 

person1.sayName(); // Nicholas
person2.sayName(); // Greg"
```
Here **sayName()** is defined in the prototype instead of the constructor. **sayName()** is now a **prototype property** instead of an **own property**. 

One of the main concerns when using the prototype is that the data would be shared among all the instances and this could lead to some unexpected behaviour as depicted below.

```js
function Person(name) {
    this.name = name;
}

Person.prototype.sayName = function() {
    console.log(this.name);
};

Person.prototype.favorites = [];
var person1 = new Person("Nicholas");
var person2 = new Person("Greg");
person1.favorites.push("pizza");
person2.favorites.push("quinoa");
console.log(person1.favorites);
console.log(person2.favorites);
```
#### Expected Output
    ["pizza"]
    ["quinoa"] 
#### Actual Output
    ["pizza", "quinoa"]
    ["pizza", "quinoa"]

As you can see, the **favorites** property is defined on the prototype of person and hence is shared by all the instances. We might be expecting the two instances to have their own copies of favourites however, **person1.favorites** and **person2.favorites** point to the **same array**. So we are essentially appending to the same array.

In the above example, we had to type **Person.prototype** each time we had to add a property to it. This can be replaced by a more compact notation as shown below

```js
function Person(name) {
    this.name = name;
}
var obj =  {
    sayName: function() {
        console.log(this.name);
    },
    toString: function() {
        return "[Person " + this.name + "]";
    }
};
Person.prototype = obj;
```

Here we use an **object literal** to encapsulate all the properties we want to add to the prototype, and assign it just once.

## Caveat #4
When using an object literal to assign prototypes, we are essentially overwriting the prototype of Person and as a result, the **constructor** of the instance is **reset** from **Person** to **Object** as shown below.  

```js
function Person(name) {
    this.name = name;
}
var obj =  {
    sayName: function() {
        console.log(this.name);
    },
    toString: function() {
        return "[Person " + this.name + "]";
    }
};
Person.prototype = obj;

var person1 = new Person("Nicholas");
console.log(person1 instanceof Person); // True
console.log(person1.constructor === Person); // False
console.log(person1.constructor === Object); // True
```
When a function is created, its prototype is created with a constructor property pointing to itself as you can see in the first figure below. The second figure represents the **obj** object from the example above.

<div style="text-align:center;">
    <img src="/images/prototype-before.png" alt="Prototype Before"/>
</div>

When we assign **obj** to **Person.prototype**, we are essentially doing the following. 
<div style="text-align:center;">
    <img src="/images/prototype-after.png" alt="Prototype After"/>
</div>

Now, it's evident that the constructor attribute of the object **person1** is indeed inherited from **Object.prototype**.  

To avoid this, we need to restore the constructor for **Person**, while assigning the prototype as follows

```js
function Person(name) {
    this.name = name;
}

Person.prototype = {
    constructor: Person,
    sayName: function() {
        console.log(this.name);
    },
    toString: function() {
        return "[Person " + this.name + "]";
    }
};
var person1 = new Person("Nicholas");
var person2 = new Person("Greg");

console.log(person1 instanceof Person); // True
console.log(person1.constructor === Person); // True
console.log(person1.constructor === Object); // False

console.log(person2 instanceof Person); // True
console.log(person2.constructor === Person); // True
console.log(person2.constructor === Object); // False
```

#### To summarise
* There is **no direct link** between an **instance and it's constructor**. 
* There is a direct link between an **instance and its prototype**.
* There is a direct link between the **prototype and the constructor**.

<div style="text-align:center;">
    <img src="/images/prototype-instance-relationship.png" alt="prototype-instance-relationship"/>
</div>

## Prototypal Inheritance
Prototype properties are automatically available to all the object instances which is a form of **inheritance**. The object instances inherit properties from its prototype. Since the prototype is also an object, it can inherit properties from its prototype and so on. This is known as **prototype chaining**.

Any object defined using the object literal notation automatically has the **[[Prototype]]** property set to **Object.prototype** which means it inherits properties from **Object.prototype**.

#### Example
```js
var book = {
    title: "The Principles of Object-Oriented JavaScript"
};
var prototype = Object.getPrototypeOf(book);
console.log(prototype === Object.prototype); // True
```
## valueOf()
**valueOf()** method is called whenever an operator is used on an object. Default action is to return the object instance. It is because of **valueOf()** that we are able to compare objects, add/subtract objects etc. Is is also possible to override the default behaviour of **valueOf()** to cater to more complex objects.

## toString()
**toString()** method is used as a fallback whenever **valueof()** returns a reference value instead of a primitive value.
For example, When a string is used as one operand for the plus operator, the other operand is automatically converted to a string. If the variable is a primitive, **toString()** is called directly. If the variable is holds a reference type, **valueOf()** is called and if valueOf() returns a reference value, **toString()** is called and the returned value is used.   

```js
var book = {
    title: "The Principles of Object-Oriented JavaScript"
};
var message = "Book = " + book;
console.log(message);
```
#### Output 
    "Book = [object Object]"

Since book is an object, its **toString()** method is called and since **toString()** is inherited from **Object.Prototype**, it returns the default value of **[object Object]**.

It is also possible to define your own **toString()** method so that it returns something more meaningful than the default.
```js
var book = {
    title: "The Principles of Object-Oriented JavaScript",
    toString: function() {
        return "[Book " + this.title + "]"
    }
};
var message = "Book = " + book;
console.log(message);
```
#### Output
    "Book = [Book The Principles of Object-Oriented JavaScript]"

## Constructor Inheritance 
Every function has its own prototype property as seen earlier. This prototype property is automatically assigned to be a new generic object that is inherited from **Object.Prototype**. The following is automatically done by the JS Engine.

```js
// you write this
function YourConstructor() {
// initialization
}

// JavaScript engine does this for you behind the scenes
YourConstructor.prototype = Object.create(Object.prototype, {
                            constructor: {
                            configurable: true,
                            enumerable: true,
                            value: YourConstructor
                            writable: true
                                }
                            });

```
Since any instance of **YourConstructor** also inherits from **Object.Prototype**, **YourConstructor** is a **subtype** of **Object** and Object is a **supertype** of **YourConstructor**.

Consider the following example
```js
function Rectangle(length, width) {
    this.length = length;
    this.width = width;
}
Rectangle.prototype.getArea = function() {
    return this.length * this.width;
};
Rectangle.prototype.toString = function() {
    return "[Rectangle " + this.length + "x" + this.width + "]";
};
function Square(size) {
    this.length = size;
    this.width = size;
}
// inherits from Rectangle
Square.prototype = new Rectangle();
// Reset the constructor
Square.prototype.constructor = Square;
Square.prototype.toString = function() {
    return "[Square " + this.length + "x" + this.width + "]";
};
```

The square constructor has its prototype property overwritten to an instance of Rectangle. Since the constructor is also overwritten, it is reset back to Square. The **getArea()** method of **Rectangle** is inherited by instances of **Square** using **prototype based inheritance**.

```js
var rect = new Rectangle(5, 10);
var square = new Square(6);
console.log(rect.getArea()); // 50
console.log(square.getArea()); // 36

console.log(rect.toString()); // "[Rectangle 5x10]"
console.log(square.toString()); // "[Square 6x6]"

console.log(rect instanceof Rectangle); // true
console.log(rect instanceof Object); // true
console.log(rect instanceof Square); // false

console.log(square instanceof Square); // true
console.log(square instanceof Rectangle); // true
console.log(square instanceof Object); // true
```
The square variable is considered an instance of Square as well as Rectangle and Object because instanceof uses the prototype chain to determine the object type.

The scenario is depicted in the following diagram

<div style="text-align:center;">
    <img src="/images/square-rectangle.png" alt="prototype-instance-relationship"/>
</div>

Inheriting from **Rectangle** without using the **Rectangle** constructor.

```js
// inherits from Rectangle
function Square(size) {
    this.length = size;
    this.width = size;
}
Square.prototype = Object.create(Rectangle.prototype, {
                                constructor: {
                                configurable: true,
                                enumerable: true,
                                value: Square,
                                writable: true
                                    }
                                });
Square.prototype.toString = function() {
    return "[Square " + this.length + "x" + this.width + "]";
};

```

## Constructor stealing
In javascript, inheritance is achieved through prototype chaining so there is **no need** to explicitly call the supertype's constructor. 

Recall that the **call()** and **apply()** methods can be used to call a function with an **explicit context**. When we call the supertype constructor from the subtype constructor using either **call()** or **apply()** to pass the newly created object, it is known ans **constructor stealing** because in essence we are essentially stealing the supertype's constructor for your own object. 

```js
function Rectangle(length, width) {
    this.length = length;
    this.width = width;
}
Rectangle.prototype.getArea = function() {
    return this.length * this.width;
};
Rectangle.prototype.toString = function() {
    return "[Rectangle " + this.length + "x" + this.width + "]";
};
// inherits from Rectangle
function Square(size) {
    Rectangle.call(this, size, size);
    // optional: add new properties or override existing ones here
}
Square.prototype = Object.create(Rectangle.prototype, {
                                    constructor: {
                                    configurable: true,
                                    enumerable: true,
                                    value: Square,
                                    writable: true
                                        }
                                    });

Square.prototype.toString = function() {
    return "[Square " + this.length + "x" + this.width + "]";
};
var square = new Square(6);
console.log(square.length);
console.log(square.width);
console.log(square.getArea());
```
The **Square** constructor calls the **Rectangle** constructor and passes in **this** as well as **size** two times (once for **length** and once for **width** ). Doing so creates the **length** and **width** properties on the new object and makes
each equal to **size** .

This approach is typically referred to as **pseudoclassical inheritance** because it
mimics classical inheritance from class-based languages.