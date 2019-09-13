# CORS (Cross Origin resource sharing)
    Define origin as 
    1) same domain
    2) same sub-domain
    3) same protocol
    4) same port

even http -> https not allowed 

by default xhr doesnt allow cross orgin because it follows same origin policy

whehn you send a reuest frokm yuor site to some other ste, the server sends back aa response, it is innfacrt **the  browser** which checks certain the headers in 
the response and **enforces the sanme origin policy** 

enable cors on the server side by allowing Access control headers. 

