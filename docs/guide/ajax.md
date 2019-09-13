# AJAX
Just like **REST** and **GraphQL**, **AJAX** (Asynchronous Javascript and XML) is basically a guideline and it's implementation is left to the developer. Over the years though, few methods have become more popular than the others and that's what we'll be discussing about.
* #### Hidden Frames
* #### Image based Ajax
* #### Dynamic Scripts
* #### XHR (XML Http Request) 
XHR is the method that is implemented in most libraries including jQuery, Angular etc. becuase it is really simple to use and also 


## Hidden frames (GET)
A **\<frame\>** or an **\<iframe\>** is basically like any other html tag but it has a unique property. When it's **src** attribute is set, a request is automatically sent to the URI, to fecth this resource. And this happens asynchronously without the current page reloading! 

Since a **\<frame\>** is an html element, it gets rendered on the DOM but we want it to be hidden! 

Refreshing our CSS concepts, this can be achieved in the following ways
* #### By setting it's height and width properties to 0
```html
<iframe id="hidden_frame" height="0" width="0"></iframe>
```

* #### By setting it's visibility property to hidden
```html
<iframe id="hidden_frame" style="visibility: hidden"></iframe>
```

* #### By setting it's display property to none
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

#### Heres what happens
* The input field for **SRN** has an **onBlur event handler** registered to it. When it looses focus, the **src attribute** of the **iframe** is set, which automatically makes a **GET** request to the server.
* The **response** from the server **contains a script** that causes the **responseHandler()** function to execute and populate the response on the page.

#### Server Side Script (test.php)
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
* We extract the parameters using the **extract** function and this makes the variable **$day** available. 
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

#### Heres what happens
* Similar to the previous example, the input field for **SRN** has an **onBlur event handler** registered to it. When it looses focus, the form is submitted. 
* The form has it's method set to **POST** and has the **target** atribute set to the name of the **iframe**. This ensures that the user is not navigated to new page and the response from the server goes to the element specified in .
* The **response** from the server **contains a script** that causes the **responseHandler()** function to execute and populate the response on the page.

#### Server Side Script (test.php)
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

## Advantages of Hidden Frames
* The hidden frames method **preserves** the **browser history** and allows the user to use the back and forward buttons effectively.
* It also allows us to **use both GET** and **POST** HTTP methods for implementing AJAX.
## Disadvantages of Hidden Frames
* There is **no support for Cross Origin Resource Sharing** (CORS) using this method.
* The method relies on the fact that the server always returns a correct and valid response. i.e. there is **no error handling mechanism** built into the hidden frames method.




## Image based AJAX
This method is similar to hidden frames. We create an **\<img\>** element programatically and never append it to the DOM. 

used mainly for binary responses since only images can be returned.

return either an existing image  -- requires contentType header, and location header
generate an image and return it.

### Disadvantages of this approach compared to hidden frame?
    Not possible to sent back text. The only way possible it to set a cookie x



## Dynamic Scripts and Stylesheets 



## XHR

ready state = 0 = var xhr = new XMLHttpRequest()
            = 1 = xhr.open("GET", url, true)
            = 2 = xhr.send()
            = 3 = processing
            = 4 = Completed 
status codes 100
             200 OK
             300 Redirection
             302  
             400 Client side error
             500 Server side error

xhr.onReadyStateChanged = eventHandler

### For text files 
### for JSON GET
### for JSON POST
### for XML
### for binary data (Video Streaming)
