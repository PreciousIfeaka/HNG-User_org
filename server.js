const server = require("./app");
require("dotenv").config();

const PORT = process.env.SERVER_PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});