import express from 'express';
import http from 'http';
import cors from 'cors';
import { init } from './socketConnection';
import { routerApp } from "./routes/routes";
import "dotenv/config.js";

const PORT = process.env.PORT || 8080;
const app = express(); 
const server = http.createServer(app);

app.use(cors());

init(server);

routerApp(app);

server.listen(PORT, () => {
  console.clear();
});
