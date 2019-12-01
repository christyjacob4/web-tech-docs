# Performance Considerations



Content optimisation techniques
1) Markup Optimisation
* remove unnecessary comments, whitespaces and indentation
* remap color values from their long 6 char representation to 3 char representation

2) CSS Optimisation 
* remove all whitespaces and comments
* remap colors to their shortest values
* use shorthand notations as much as possible.

3) JS Optimisation 
* A single line can have the entire script. Remove all comments. They are useless to the end user.
* Remove all whitespaces. Be careful with ';' character.
* Perform code optimizations
* You can replace meaningful variables with s, x, y 
* Remap built-in objects to save space.
* Minimize DOM access as much as you can.
* Use external JavaScript. 

4) Additional Optimisations
* Choose the right format for downloading data. (XML/JSON/Text)
* If you are using images, do not set the "src" attribute until it is required. Merely setting the src to an empty string also wastes a call. The following is very bad.    
```html
<img src=""/> 
```
And later in code, you do 
```js
img.src = "http://somesrvr/img.jpg";
```
* Try to use "GET" as the method as often as you can. Experiments have shown that POST is actually a two step process (headers are sent first and then the body) unlike GET which takes only ONE TCP packet. 

## Caching 


### Expires
Time doesnt change in the example even after 10 seconds.
### Cache control
Time changes after 10 seconds.. within 10 seconds, it doesn't change 

works only with GET requests.. if its a POST request, cache doesnt work. even if the header is set, there will be a request made to the server
POST responses are NOT cached in spite of the "Expires" header being set by the server (Or for that matter the Cache-control header). You have to MANUALLY cache the POST responses.

 Manually cache wherever possible. This way, dependency on browser is much reduced (cross browser issues are eliminated too). Before you make new requests, check for cached data in the browser’s memory and use it if you can.      

 Predictive Fetch pattern needs to be implemented judiciously. (Can prefetch and cache  both on client and server side).
 External JavaScript can be cached. This will slow down the first download/execution but the browser can cache downloaded JS and subsequent page downloads (which use the same JS) will be significantly faster because the JS files are already there with the browser.
 Use the “Expires” header judiciously to cache information. (But this means the browser can arbitrarily choose to persist the data even after the expiry date.). Hence you will need to use the URL manipulating method to force a new fetch for the cached content. The “Expires” header is very effective in caching static data received through AJAX.
 Alternately, use the “Cache-control” header (http 1.1). This is much better than the “Expires” header.
 POST responses are NOT cached in spite of the "Expires" header being set by the server (Or for that matter the Cache-control header). You have to MANUALLY cache the POST responses.
 Manually cache wherever possible. This way, dependency on browser is much reduced (cross browser issues are eliminated too). Before you make new requests, check for cached data in the browser’s memory and use it if you can.      	  


## Compression
reduce teh amount of data that goes back and forth between the client nand server

1) reduce the space consumed by the JS files, CSS files, HTML files,
2) Remove Unnecessary white spaces
3) remove comments
4) transform variable names to single alphabets 
-- reduces network traffic
-- called minification
-- code obsurfication 


How to send compressed data from the server to the client

Accept-Encoding header tells which compression formats, the browser can support
eg : gzip, deflate, brotli

super global arrays ... 

At the server side, check the accept encoding header from the client and send the 
encoded response in a format that the client requires. else send the uncompressed version.
HTTP_ACCEPT_ENCODING is a string like "gzip,deflate,sdch"

check using
```php
if(strpos($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')===false){
	// Do something
}
```

at the server side use the content-encoding header to inform the client about the encoding method used.
else the client would render the raw response without decoding.


```php
<?php
header("Content-encoding : deflate")
$encoding = $SERVER["HTTP_ACCEPT_ENCODING"]
$file       = fopen("data.txt", "r");
$datastring = fread($file, filesize("comp.txt"));
$output     = gzdeflate($datastring, 9);
echo $output;
?>

```

## Request Manager


## Timing Issues

php employs a mechnaism called session locking

if a request r1 has session_start(), then this locks $_SESSION . Thus at any one time, only one request can access the session
another request r2 also has session_start(). r2 is executed 5 seconds after r1 . In this case there is no conflict since they execute at different intervals of time

consider when r1 is a db intensive request and takes 10 seconds to complete. while r2 is simple request and takes only 2 seconds to complete. what is the order of responses?
Due to session locking , r1 first gets a lock on the session  and hence holds this lock until completion i.e for 10 seconds and the response is returned. then r2 gets a session lock and returns a response. 
This is what is supposed to happen theoritically but we observe otherwise.. due to race conditions ..
Even though you expect the code to work in a certain way, the order in whihc the output actually comes back can be different.   