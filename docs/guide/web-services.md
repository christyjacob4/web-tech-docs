# Web Services

Create -- POST
Read -- GET
Update -- PUT
Delete -- DELETE

## REST

## SOAP

### Creating a web service

we have access to COE data
create a restful web service supporting 2 crud ops - GET and PUT

we will be

1. Design web service
2. design the documentation -- word document

create a url rewriting code in htaccess. Could also do it in httpd.conf but then we'd have to restart the server.

Implementing the GET part

we could directly sned requests from the browser to the web service but this is a cross domain request and if cors headers are disabled at the
web service end, then we cannot use this approach.
So we send a get request to our server. the server uses file_get_contents to make a request to the web service and fetches the results and sends it back to the client

```php
<?php

$res=array();
if($_SERVER["REQUEST_METHOD"]=="GET"){
	extract($_GET);

	if($srn=='001'){
		$res["status"]=200;
		$res["message"]="sucess";
		$res["data"]="9.9";
	}
	else{
		$res["status"]=200;
		$res["message"]="failure";
		$res["data"]=null;

	}
}
	echo json_encode($res);
?>
```

make reqeusts as http://localhost/service.php?srn=001

but this url is not very user friendly.. so we would like the users to make a request to a more readable and user friendly url like
http://localhost/student/read/001 to invoke the above service

But how would you achieve this? Our service is still hosted at service.php. How would you map a request coming in at http://localhost/student/read/001 to http://localhost/service.php?srn=001 ?
This is done by URLRewriting using rewrite engine

enable URL rewriting in httpd.conf find document root .. allow overwrite : none -> all
 

Create a rewrite rule in .htaccess

RewriteEngine ON
RewriteRule ^student/read/([0-9]{3}) service.php?srn=\$1

This rewrite rule will map all incoming requests to /student/read/001 to service.php?srn=001

This can also be done in httpd.conf but those rules apply to all files and folders, and also requires server restart

### implementing the put part

There is no $_PUT or a $_DELETE so how do you get the parameters?

the body of the request is available in php's input stream which is accessible through a temporary file called php://input
using file_get_contents("php://input") we can access the input stream.

```php
<?php
$res=array();
if($_SERVER["REQUEST_METHOD"]=="PUT"){
        $params=file_get_contents("php://input");
        
        // srn=001&gpa=9.9
        $arr=explode("&",$params);
        
        // srn=001
		$srnarr=explode("=",$arr[0]);
        $srn=$srnarr[1];
        
        // gpa=9.9
		$gpaarr=explode("=",$arr[1]);
        $gpa=$gpaarr[1];
        
		$file=fopen("data.txt","w");
		$data=$srn.":".$gpa;
		fwrite($file,$data);
		fclose($file);
		$res["status"]=200;
		$res["message"]="updated";
		$res["data"]=null;


}
	echo json_encode($res);
?>
```

create a url rewrite rule for update

RewriteEngine ON
RewriteRule ^update  service.php