# CORS (Cross Origin resource sharing)
the designers icluded the same orign policy. in simple terms, an XHR can be placed only from a page hosted on a particular site to another page hosted on the same website.   

even http -> https not allowed 

by default xhr doesnt allow cross orgin because it follows same origin policy

An  XHR can only originate from the same origin.

    Define same origin as 
    1) same domain
    2) same sub-domain
    3) same protocol
    4) same port
this was done to ensure securirty. as CDNs and other others gained more populrity, 


when you send a reuest frokm yuor site to some other ste, the server sends back aa response, it is innfacrt **the  browser** which checks certain the headers in 
the response and **enforces the sanme origin policy** 

<div style="text-align:center">
    <img src="/images/cors.png" alt="CORS Image"/>
</div>


enable cors on the server side by allowing Access control headers. 

Simple requests 
get, head, 

post is a simple request as long as 
1 ) doen'st havr any custom headers
1) The content typs is text/ form url encoded or multipart form data.


Preflight requests
put requests, delete, post with custom headers.
request takes place in two phases
1) **OPTION** request is sent , get the response backm, check the headers 
2) then allow the actual resource to pass through.  


