# HTTP Server

## This is my own HTTP server build from scratch using javascript

## Milestone 1: Basic server setup

  ### 1. Set up the project:
  Initialize a new project folder, set up a package.json, and create an entry file (e.g., server.js).
  ### 2. Creating Basic Server:
  Use the net module to create a raw TCP server that listens on a specific port (e.g., 8080).
  ### 3. Accept Connection:
   Write code to handle incoming connections and output any raw data received from clients to the console.

## Milestone 2: Parsing HTTP Requests:
  ### 1. Extract HTTP data:
  Parse the raw data from incoming requests to understand the structure of an HTTP request (start line, headers, body).
  ### 2. Handle different request methods:
  Focus on basic methods like GET and POST.
  ### 3. Validate requests:
  Implement basic validation to ensure the requests have a valid structure, e.g., check for Host headers in HTTP/1.1.