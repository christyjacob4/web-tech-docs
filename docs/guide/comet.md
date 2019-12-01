# COMET Techniques

Using AJAX we were able to send asynchronous requests to the server in what was known as a client pull. 

also called reverse ajax or server push 
COMET is an umbrella term incorporating various 




<div style="text-align:center;">
    <img src="/images/comet-methods.png" alt="Web Sockets"/>
</div>

## Long Polling

Long poll - request → wait → response. Creates a connection to the server like AJAX does, but maintains a keep-alive connection open for some time (not long though). During connection, the open client can receive data from the server. The client has to reconnect periodically after the connection is closed, due to timeouts or data eof. On server side it is still treated like an HTTP request, same as AJAX, except the answer on request will happen now or some time in the future, defined by the application logic.

## Streaming


## Server Sent Events
Server-Sent Events - client ← server. Client establishes persistent and long-term connection to server. Only the server can send data to a client. If the client wants to send data to the server, it would require the use of another technology/protocol to do so. This protocol is HTTP compatible and simple to implement in most server-side platforms. This is a preferable protocol to be used instead of Long Polling. 

## Web Sockets

WebSockets - client ↔ server. Create a TCP connection to the server, and keep it open as long as needed. The server or client can easily close the connection. The client goes through an HTTP compatible handshake process. If it succeeds, then the server and client can exchange data in both directions at any time. It is efficient if the application requires frequent data exchange in both ways. WebSockets do have data framing that includes masking for each message sent from client to server, so data is simply encrypted.

```html
<!DOCTYPE html>
<html>

<head>
    <style>

    </style>
    <script>
        function wsocket() {
            var wsURI = "ws://localhost:12345/ws.php";
            websocket = new WebSocket(wsURI);
            websocket.onopen = function(ev) {

                alert("connected");

            }
            websocket.onclose = function(ev) {

                alert("connection closed");

            }
            websocket.onerror = function(ev) {

                alert("problem")

            }
            websocket.onmessage = function(ev) {

                console.log("Message" + ev.data);
            }

        }

        function sendMessage() {

            var msg = document.getElementById("msg").value;
            websocket.send(msg);
        }
    </script>
</head>

<body onload="wsocket()">
    <input type="text" id="msg" onblur="sendMessage()" />
</body>

</html>
```



```php
<?php
$address = '0.0.0.0';
$port    = 12345;
/* Create WebSocket:Creates and returns a socket resource, also referred to as an endpoint of communication. A typical network connection is made up of 2 sockets, one performing the role of the client, and another performing the role of the server.*/
$server  = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
/*The socket_set_option() function sets the option specified by the optname parameter, at the specified protocol level, to the value pointed to by the optval parameter for the socket.*/
socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1);
/*Binds the name given in address to the socket described by socket. This has to be done before a connection is be established*/
socket_bind($server, $address, $port);
/*listen for incoming connections on socket.*/
socket_listen($server);
/*this function will accept incoming connections on that socket. Once a successful connection is made, a new socket resource is returned, which may be used for communication.*/
$client  = socket_accept($server);
// Send WebSocket handshake headers.
$request = socket_read($client, 5000);
preg_match('#Sec-WebSocket-Key: (.*)\r\n#', $request, $matches);
$key     = base64_encode(pack('H*', sha1($matches[1] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
$headers = "HTTP/1.1 101 Switching Protocols\r\n";
$headers .= "Upgrade: websocket\r\n";
$headers .= "Connection: Upgrade\r\n";
$headers .= "Sec-WebSocket-Version: 13\r\n";
$headers .= "Sec-WebSocket-Accept: $key\r\n\r\n";
socket_write($client, $headers, strlen($headers));
while ($rcvd = socket_read($client, 4096)) {
    $data = unmask($rcvd);
    $rev  = strrev($data);
    $resp = chr(129) . chr(strlen($rev)) . $rev;
    socket_write($client, $resp, strlen($resp));
}
// Send  messages into WebSocket in a loop.


function unmask($text)
{
    $length = ord($text[1]) & 127;
    if ($length == 126) {
        $masks = substr($text, 4, 4);
        $data  = substr($text, 8);
    } elseif ($length == 127) {
        $masks = substr($text, 10, 4);
        $data  = substr($text, 14);
    } else {
        $masks = substr($text, 2, 4);
        $data  = substr($text, 6);
    }
    $text = "";
    for ($i = 0; $i < strlen($data); ++$i) {
        $text .= $data[$i] ^ $masks[$i % 4];
    }
    return $text;
}
```

The main advantage of WebSockets server-side, is that it is not an HTTP request (after handshake), but a proper message based communication protocol. This enables you to achieve huge performance and architecture advantages. For example, in node.js, you can share the same memory for different socket connections, so they can each access shared variables. Therefore, you don't need to use a database as an exchange point in the middle (like with AJAX or Long Polling with a language like PHP). You can store data in RAM, or even republish between sockets straight away.


<div style="text-align:center;">
    <img src="/images/web-sockets.gif" alt="Web Sockets"/>
</div>