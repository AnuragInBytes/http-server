import net from 'net';

const PORT = 8080;

const server = net.createServer((socket) => {
    console.log('New connection established.');

    socket.on('data', (data) => {
        const request = data.toString();
        console.log("Received request: \n\n", request);

        //Step 1: Parse the request line
        const [requestLine, ...headerLines] = request.split('\r\n');
        const [method, path, version] = requestLine.split(' ');

        if(!isValidRequestLine(method, path, version)){
            sendBadRequestResponse(socket);
            return;
        }

        console.log("Method: ", method);
        console.log("Path: ", path);
        console.log("Version: ", version);

        // Step 2: Parse headers
        const headers = {};
        let i = 0;
        while(headerLines[i] !== ""){
            const [key, value] = headerLines[i].split(": ");
            headers[key] = value;
            i++;
        }

        if(!isValidHeader(headers, method)){
            sendBadRequestResponse(socket);
            return;
        }
        console.log("headers: ", headers);

        // Step 3: Handle different request methods

        if(method === "GET"){
            handleGetRequest(socket, path);
        } else if(method === "POST"){
            handlePostRequest(socket, request, headers);
        } else{
            sendNotAllowedRequest(socket);
        }
    });

    socket.on('end', () => {
        console.log("Connection Closed.");
    });
});

function isValidHeader(headers, method){
    if(!headers['Host']){
        console.log("Missing Host header");
        return false;
    }

    if(method === 'POST' && !headers['Content-Length']) {
        console.log("Missing Content-Length header is POST request");
        return false;
    }

    return true;
}

function isValidRequestLine(method, path, version){
    if(version !== "HTTP/1.1"){
        console.log("Invalid HTTP version: ", version);
        return false;
    }

    const allowedMethod = ['GET', 'POST'];
    if(!allowedMethod.includes(method)){
        console.log("Invalid method: ", method);
        return false;
    }

    const pathPattern = /^\/[a-zA-Z0-9\/\-_\.]*$/;
    if(!pathPattern.test(path)){
        console.log("Invalid path: ", path);
        return false;
    }
    return true;
}

// request functions
function handleGetRequest(socket, path){
    // routing

    if (path === '/favicon.ico') {
        const response =
            `HTTP/1.1 204 No Content\r\n` +
            `Connection: close\r\n` +
            `\r\n`;
        socket.write(response);
        socket.end();
        return;
    }
    let responseBody = `<h1>Welcome to ${path}</h1>`;

    if(path === '/'){
        responseBody = '<h1>Home Page</h1>';
    } else if(path === '/about'){
        responseBody = '<h1>About page</h1>';
    } else{
        responseBody = "<h1>404 Not Found</h1>";
    }

    const response =
        `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/html\r\n` +
        `Content-Length: ${Buffer.byteLength(responseBody)}\r\n` +
        `Connection: closed\r\n` +
        `\r\n` +
        responseBody;

    socket.write(response);
    socket.end();
}
function handlePostRequest(socket, request, headers){
    // exctract data from request body
    const requestBody = request.split(`\r\n\r\n`)[1];

    const responseBody = `
        <html>
            <body>
                <h1>Post Data Received:</h1>
                <p>${requestBody}</p>
            </body>
        </html>
    `;

    const response =
        `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/html\r\n` +
        `Content-Length: ${Buffer.byteLength(responseBody)}\r\n` +
        `Connection: close\r\n` +
        `\r\n` +
        responseBody;


    socket.write(response);
    socket.end();
}
function sendNotAllowedRequest(socket) {
    const responseBody = `<h1>405 Method Not Allowed</h1>`;
    const response =
        `HTTP/1.1 405 Method Not Allowed\r\n` +
        `Content-Type: text/html\r\n` +
        `Content-Length: ${Buffer.byteLength(responseBody)}\r\n` +
        `Connection: close\r\n` +
        `\r\n` +
        responseBody;

    socket.write(response);
    socket.end();
}
function sendBadRequestResponse(socket){
    const responseBody = `<h1>400 Bad Request</h1>`;
    const response =
        `HTTP/1.1 400 Bad Request\r\n` +
        `Content-Type: text/html\r\n` +
        `Content-Length: ${Buffer.byteLength(responseBody)}\r\n` +
        `Connection: close\r\n` +
        `\r\n` +
        responseBody;

    socket.write(response);
    socket.end();
}

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});
