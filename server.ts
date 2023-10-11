import express from 'express';
import http from 'http';
import cors from 'cors';
import { init } from './socketConnection';
import { routerApp } from "./routes/routes";

const PORT = 3000;
const app = express(); 
const server = http.createServer(app);

app.use(cors());

init(server);

routerApp(app);

server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log(`Example app listening on port ${PORT}!\n\n\n`
)});
