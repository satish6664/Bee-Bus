{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "test-db-connection.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/test-db-connection",
      "dest": "/test-db-connection.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
