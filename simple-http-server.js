const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simple HTTP Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>Simple HTTP Server</h1>
      <p>If you can see this page, the HTTP server is working correctly.</p>
      <p>This suggests that there might be an issue with the Vite development server or the React application itself.</p>
      <p>Current time: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `);
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
