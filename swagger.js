const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "HNG User-Organisation API",
    description: "The API contains endpoints for the interaction between users and organisations"
  },
  host: "https://hng-user-org.vercel.app/"
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log("Swagger documentation generated successfully");
})