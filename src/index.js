import net from 'net';

const PORT = 8080;

const server = net.createServer((socket) => {
    console.log('New connection established.');

    socket.on('data', (data) => {
        const request = data.toString();
        console.log('Received request:\n', request);

        // Step 1: Parse the request line
        const [requestLine, ...headerLines] = request.split('\r\n');
        const [method, path, version] = requestLine.split(' ');

        console.log('Method:', method);
        console.log('Path:', path);
        console.log('Version:', version);

        // Step 2: Parse headers
        const headers = {};
        let i = 0;
        while (headerLines[i] !== '') {
            const [key, value] = headerLines[i].split(': ');
            headers[key] = value;
            i++;
        }

        console.log('Headers:', headers);

        // Step 3: Construct a valid HTTP response
        const responseBody = `
            <html>
            <body>
                <h1>HTTP Server Response</h1>
                <p>Method: ${method}</p>
                <p>Path: ${path}</p>
                <p>Version: ${version}</p>
                <h2>Headers:</h2>
                <pre>${JSON.stringify(headers, null, 2)}</pre>
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

        // Send the response and close the connection
        socket.write(response, (err) => {
            if (err) console.error("Error sending response:", err);
            socket.end();
        });
    });

    socket.on('end', () => {
        console.log('Connection closed.');
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
