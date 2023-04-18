import express from "express";
const app = express();
import http from "http";
const PORT = 8000;
import { connectDB } from "./config/db";
import { router } from "./router/router";
import cors from "cors";
import { socket } from "./socket/socket";

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
 
socket(server);

app.use("/", router);

server.listen(PORT, () => {
  console.log("Server is up and running " + PORT);
});