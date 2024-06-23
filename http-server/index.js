const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const port = args.port || 3000; 

let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    console.error("Error reading home.html:", err);
    process.exit(1);
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    console.error("Error reading project.html:", err);
    process.exit(1);
  }
  projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) {
    console.error("Error reading registration.html:", err);
    process.exit(1);
  }
  registrationContent = registration;
});

http.createServer((request, response) => {
  let url = request.url;

  response.writeHead(200, { "Content-Type": "text/html" });

  switch (url) {
    case "/project":
      response.write(projectContent);
      break;
    case "/registration":
      response.write(registrationContent);
      break;
    default:
      response.write(homeContent);
      break;
  }

  response.end();
}).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
