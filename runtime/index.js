import sirv from "sirv";
import polka from "polka";
import { handler } from "$handler_file";

export const applyHandler = (server) => {
  if (Array.isArray(handler)) {
    handler.forEach((h) => server.use(h));
  } else {
    server.use(handler);
  }
};

const server = polka();

server.use(sirv("./dist"));

applyHandler(server);

const { PORT = 3000 } = process.env;
server.listen(PORT);
console.log(`Ready at http://localhost:${PORT}`);
