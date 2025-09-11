// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "API documentation for Contacts Project (Week 02)",
    },
    servers: [
      {
        url: process.env.RENDER_URL || "http://localhost:3000", // change later to your Render URL
      },
    ],
  },
  apis: ["./server.js"], // tells swagger-jsdoc where to look for documentation
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
