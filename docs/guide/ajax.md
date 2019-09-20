# AJAX Techniques
Just like **REST** and **GraphQL**, **AJAX** (Asynchronous Javascript and XML) is basically a guideline and it's implementation is left to the developer. Over the years though, few methods have become more popular than the others and that's what we'll be discussing about.
* **Hidden Frames**
* **Image based Ajax**
* **Dynamic Scripts**
* **XHR (XML Http Request)** 
XHR is the method that is implemented in most libraries including jQuery, Angular etc. becuase it has a really functional and simple API with event handlers to check for errors etc.

## Hidden frames (GET)
It's crucial to understand how this method works since the following methods also use the same concept. 
A **\<frame\>** or an **\<iframe\>** is basically like any other html tag but it has a unique property. When it's **src** attribute is set, a request is automatically sent to the **URL**, to fecth this resource. And this happens asynchronously without the current page reloading! 

Since a **\<frame\>** is an html element, it gets rendered on the DOM but we want it to be hidden! 

Refreshing our CSS concepts, this can be achieved in the following ways
* **By setting it's height and width properties to 0**
```html
<iframe id="hidden_frame" height="0" width="0"></iframe>
```

* **By setting it's visibility property to hidden**
```html
<iframe id="hidden_frame" style="visibility: hidden"></iframe>
```

* **By setting it's display property to none**
```html
<iframe id="hidden_frame" style="display: none"></iframe>
```
The last method is the best suited because it removes the element from the DOM and hence doesn't affect the positions of other elements on screen.

Let's start with an example. 
Consider the following html page

```html
<html>
<head>
	<script>
		function getDetails() {
			var srn = document.getElementById("srn")
			var hf = document.getElementById("hframe")
			hf.src = "test.php?srn=" + srn.value
		}
		function responseHandler(res) {
			var resArr = res.split(";");
			document.getElementById("sname").value = resArr[1];
			document.getElementById("cgpa").value = resArr[2];
			document.getElementById("srn").value = resArr[0];
		}
	</script>
</head>
<body>
	<form>
		SRN:<input type="text" name="srn" id="srn" onblur="getDetails()" /><br />
		Name:<input type="text" name="sname" id="sname" /><br />
		CGPA:<input type="text" name="cgpa" id="cgpa" /><br />
		<iframe id="hframe" style="display:none"></iframe>
	</form>
</body>
</html>
```
 
**Heres what happens**  
* The input field for **SRN** has an **onBlur event handler** registered to it. When it looses focus, the **src attribute** of the **iframe** is set in **getDetails()**, which automatically makes a **GET** request to the server.
* The **response** from the server **contains a script** that contains a call to **responseHandler()** function, to execute and populate the response on the page.

**Server Side Script (test.php)**  
```php {1,10,12}
<script>
    <?php
        extract($_GET);
        if($srn == "SRN1")
            $ret = "SRN1;abc;9.8";
        elseif($srn == "SRN2")
            $ret = "SRN2;def;9.3";
        elseif($srn == "SRN3")
            $ret = "SRN3;ghi;9.2";
        echo "parent.responseHandler('$ret')";
    ?>
</script>
```
* The query parameters are present in the **$_GET** global array. 
* We extract the parameters using the **extract** function and this makes the variable **$srn** available. 
* We simply check some conditions and return an appropriate message. 
* A peculiar thing about this php script is that, it is enclosed in **\<script\>** tags which means that we are returning **html** from the server.  

:::tip
Notice that the **php** script is returns **executable JS** code. Once the response reaches the client, the **parent.responseHandler()** call is made and that's how we are able to asynchronously fetch data. 
:::

## Hidden frames (POST)
This is an extension of the same technique as before but, for **POST** requests. The changes in the code from the previous example have been highlighted.

```html {5,6,17,21}
<html>
<head>
	<script>
		function getDetails() {
            var frm = document.getElementById("frm")
            frm.submit();
		}
		function responseHandler(res) {
			var resArr = res.split(";");
			document.getElementById("sname").value = resArr[1];
			document.getElementById("cgpa").value = resArr[2];
			document.getElementById("srn").value = resArr[0];
		}
	</script>
</head>
<body>
	<form id="frm" method="POST" action="test.php" target="frame-name">
		SRN:<input type="text" name="srn" id="srn" onblur="getDetails()" /><br />
		Name:<input type="text" name="sname" id="sname" /><br />
		CGPA:<input type="text" name="cgpa" id="cgpa" /><br />
		<iframe id="hframe" name="frame-name" style="display:none"></iframe>
	</form>
</body>
</html>
```

**Heres what happens**  
* Similar to the previous example, the input field for **SRN** has an **onBlur event handler** registered to it. When it looses focus, the form is submitted. 
* The form has it's method set to **POST** and has the **target** atribute set to the name of the **iframe**. This ensures that the user is not navigated to new page and the response from the server goes to the element specified in .
* The **response** from the server **contains a script** that causes the **responseHandler()** function to execute and populate the response on the page.

**Server Side Script (test.php)**  
```php {3}
<script>
    <?php
        extract($_POST);
        if($srn == "SRN1")
            $ret = "SRN1;abc;9.8";
        elseif($srn == "SRN2")
            $ret = "SRN2;def;9.3";
        elseif($srn == "SRN3")
            $ret = "SRN3;ghi;9.2";
        echo "parent.responseHandler('$ret')";
    ?>
</script>
```
* On the server side we just extract the parameters from the **$_POST** global array.

### Advantages of Hidden Frames Approach
* The hidden frames method **preserves** the **browser history** and allows the user to use the back and forward buttons effectively.
* It also allows us to **use both GET** and **POST** HTTP methods for implementing AJAX.
### Disadvantages of Hidden Frames Approach
* There is **no support for Cross Origin Resource Sharing** (CORS) using this method.
* The method relies on the fact that the server always returns a correct and valid response. i.e. there is **no error handling mechanism** built into the hidden frames method.
* The **developer cannot control** the HTTP request nor the HTTP response being returned.
* Highly browser depenedent since there are several versions of **\<frame\>**, **\<iframe\>** etc.

## Image based AJAX
This method is similar to hidden frames. We create an **\<img\>** element programatically but never append it to the DOM. 
**Changing the src** property of the **\<img\>** tag, triggers a **http request** to fetch the specified resource **asynchronously**. The data returned in this case is an image and we need to make decisions based on the returned image.

For eg. to check the **availability of a username**, the user enters a username, a request is sent asynchronously and based on the dimensions of the image returned, we can make a decision as to whether the username is available or not. In this case, the server could return a **1x1 image** if the username is **not available** and a **2x2 image** if the username is **available**. 

This only enables us to make **binary decisions**. If we had to fetch more information, we would have to send this information by setting a cookie. But this is **not very robiust** since **cookies** could be **disabled** by the user.

There are two ways to do this on the server side. 
1) Creating an image programatically and then returning it to the output stream.
2) Redirecting to an image. 

### Approach 1 (Creating an Image on the server side)
```html
<html>
<head>
	<script>
		function checkUname() {
			var uname = document.getElementById("uname");
			im = document.createElement("img");
			im.src = "test.php?uname=" + uname.value
			im.onload = success;
			im.onerror = failure;
		}
		function success() {
			msgBox = document.getElementById("msg")
			if (im.width == 1)
				msgBox.innerHTML = "Not Available"
			else if (im.width == 2) 
				msgBox.innerHTML = "Available"
			else 
				msgBox.innerHTML = "Where did that come from???"
		}
		function failure() {
			msgBox.innerHTML = "Wrecked...!!!"
		}
	</script>
</head>
<body>
	<form>
		User Name: <input type="text" id="uname" onblur="checkUname()" /><br />
		<div id="msg"></div>
	</form>
</body>
</html>
```
#### Here's what happens
* The input field for **User name** has an **onBlur event handler** registered to it. When it looses focus, the **src attribute** of the **image** is set, which automatically makes a **GET** request to the **URL**.
* The event handlers for the image are assigned. If the image loads successfully, the **onload** event is triggered & if the image fails to load **onerror** event is triggered allowing us to take precautionary measures.
* In the success method, we **check the dimensions** of the image and add an appropriate message to the **\<div\>**.

#### Server Side Script (test.php)
```php
<?php
	extract($_GET);
	if($uname=="USER1"||$uname=="USER2"||$uname=="USER3"){
		// Username Not Available
		$im=imagecreate(1,1);
		imagecolorallocate($im,255,255,255);
	}
	else{
		// USername available
		$im=imagecreate(2,2);
		imagecolorallocate($im,255,255,255);	
	}
	imagejpeg($im);
?>
```
#### Here's what happens 
* The **imagecreate()** function creates an image with the specified **width** and **height** in that order, and returns a **resource identifier** to the image.
* Colours are allocated using the **imagecolorallocate()** function. It automatically fills the background of the image with the colour the first time you call it, as well as return an identifier for that particular colour. Subsequent calls to **imagecolorallocate()** will simply create a colour identifier, without affecting your image background.
* We return a **1x1** image to indicate **non-availability** and a **2x2** image if the username is **available**.


### Approach 2 (Redirecting the user to an image resource)
It is also possible to redirect the user to predefined images that are already stored on the server or elsewhere by specifying the appropriate headers. For eg. we could have two images on the server namely **available.jpg** and **not_available.jpg** with dimensions 2x2 and 1x1 respectively. If the username is available, we return available.jpg else we return not_available.jpg. The dimensions could be anything. I chose the smallest dimensions so that it doesn't unnecessarily eat up badnwidth.

```php
<?php
	extract($_GET);
	header(“Content-type: image/jpeg”);
	if($uname=="USER1"||$uname=="USER2"||$uname=="USER3"){
		// Username not available
		header(“Location: not_available.jpg”);
	}
	else{
		// Username available
		header(“Location: available.jpg”);
	}
?>
```

### Advantages of Image based Approach
* There is **some** degree of **error handling** involved by using the **onload** and **onerror** events of **\<img\>**, we can check if the image has loaded successfully, which indicates a valid response from the server and vice-versa.
* **Cross Domain Requests** is no longer a problem since  
* High level of compatiblity since images work similarly on all browsers.

### Disadvantages of Image based Approach
* Only **GET requests** are possible.
* Images sent back can only be used to make a **binary decision**. 
* Textual data can **only** be **retreived through cookies** which is both limiting **(300 per machine)** and dangerous (cookies **aren't encrypted**).
* **Cookies** may be **disabled**.
* **Images** may be **disabled**. 



## Dynamic Scripts
Similar to the previous approaches, we dynamically create a **\<script\>** element and set it's src attribute. Unlike the Image based approach, we have to **append the created \<script\> to the DOM** for this to work. 

This can be done as follows

```html
<html>
<body>
	<div id="display">
	</div>
	<button onclick="load()">Press to load</button>
	<script>
		function load() {
			s = document.createElement('script');
			s.src = "bar.php";
			document.body.append(s);
		}
	</script>
</body>
</html>
```
#### Here's what happens
* The button has an **onclick()** event handler attached to it, which is **triggered** when the **button is clicked**.
* In the event handler, we simply **create a new \<script\>** tag and set it's **src attribute**, which triggers a **GET request** to **bar.php**. 
* The script element is then **appended** to the **DOM**.  

#### Server Side Script (bar.php)
```php
<?php
	$text = "This is the information we send back to the client. Ideally this would be fetched from a database.";
	echo 'document.getElementById("display").innerHTML+="'.$text.'"';
?>
```
#### Here's what happens 
* We return **executable JS code** back to the client, where we append the fetched information to the **innerHTML** property. 

Once the **php script** finishes execution, our **html page** looks like this. This causes the fetched information to be **loaded into the \<div\>** to be displayed.

```html {13,14,15}
<html>	
<body>
	<div id="display">
	</div>
	<button onclick="load()">Press to load</button>
	<script>
		function load() {
			s = document.createElement('script');
			s.src = "bar.php";
			document.body.append(s);
		}
	</script>
	<script>
		document.getElementById("display").innerHTML+= "This is the information we send back to the client. Ideally this would be fetched from a database."
	</script>
</body>
</html>
```

### Advantages of Dynamic Scripts
* **Cross Domain requests** are **possible** with this approach.
* Both **onload** and **onerror** event handlers can also be set, allowing for **basic error handling** features.  

### Disadvantages of Dynamic Scripts
* Only **GET requests** are possible using this method. 

## Dynamic Stylesheets
This is very similar to the scripts approach. Here we create a **\<style\>** element and set it's **href attribute** to trigger the **GET  request**.

Also, **instead of appending** the created element **to the \<body\>**, we **append it** to the **\<head\>**.


## XHR (XML Http Request)
This is the most popular method that is used to make AJAX requests to a remote url. It is also very flexible allowing us to use multiple request methods to process the requst. 

Let's go through the process of creating a XHR and processing its response.

#### 1) Firstly we need to create a new XHR object.
```js
var xhr = new XMLHttpRequest();
```

#### 2) Set the readystate change handler
The xhr object has a property called readyState that keeps track of the different events during the lifetime of an XHR onject. The readyState can take on the following values.

    
| readyState | Lifecycle | 
| :---: | :---: |
| 0 | var xhr = new XMLHttpRequest() |
| 1 | xhr.open("GET", url, true) |
| 2 | xhr.send() |
| 3 | Processing |
| 4 | Completed |

 
* #### Using named functions 
```js
function handler() {
	// Do stuff
}
xhr.onreadystatechange = handler
```
* #### Using anonymous functions
```js
xhr.onreadystatechange = function(){
	// Do Stuff
}
```
Within the handler we need to first check if the ready state equals 4 to ensure that the response has been received. We also need to check if the response status is successful. 

| Response Status | Reason | 
| :---: | :---: |
| 200 | OK |
| 300 | Redirection |
| 4xx | Client Side Error |
| 5xx | Server Side Error |

```js
xhr.onreadystatechange = function(){
	if(this.status === 200 && this.readyState === 4){
		// Do stuff
	}
}
```

#### 3) Specify request parameters
We then use the open method to specify our request method, the url and if the function should execute asynchronously
```js
xhr.open("GET", "http://foo.com", true)
```
For **POST** requests, we need to additionally specify the **MIME type** of the data using the **Content-type** header.

```js
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
```

#### 4) Send the request

```js
xhr.send()
```



## Summary 


| Technique | Cross Domain Requests | Code intent and clarity | Error Handling | History of Requests | Request Type | 
| ----- |:--:| :---:| :---: | :---: | :---: |
| Hidden Frames | Yes/No* | Avg | Poor | Yes | GET, POST | 
| Image Based | Yes | Good | Good | No | GET | 
| Script Based | Yes | Good | Good | No | GET | 
| XHR Based | Yes/No* | Very Good | Very Good | No | GET, POST | 