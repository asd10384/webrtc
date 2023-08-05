import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import { readdirSync } from "fs";
import { join } from "path";
import { WebSocket } from "./api/webSocket";

const maxAge = 1000 * 15;

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET?.trim() || `secret`,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: process.env.PRODUCTION?.trim() === "true" ? true : false
  }
}));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, "html"));
app.use('/favicon.ico', express.static(join(__dirname, "images", "favicon.ico"), { cacheControl: true, maxAge: maxAge }));
app.use('/service-worker.js', express.static(join(__dirname, "js", "service-worker.js"), { cacheControl: true, maxAge: maxAge }));
app.use('/css', express.static(join(__dirname, "css", "/"), { cacheControl: true, maxAge: maxAge }));
app.use('/images', express.static(join(__dirname, "images", "/"), { cacheControl: true, maxAge: maxAge }));
app.use('/js', express.static(join(__dirname, "js", "/"), { cacheControl: true, maxAge: maxAge }));
app.use('/file', express.static(join(__dirname, "/"), { cacheControl: true, maxAge: maxAge }));

const route = readdirSync(join(__dirname, 'routes')).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
route.forEach((file) => {
  app.use(require(join(__dirname, "routes", file.replace(/\.js|\.ts/, ''))).default);
});

app.use((_req, res) => {
  return res.status(404).json({ err: "Page Not Found" });
});



const PORT = process.env.PORT?.trim() || 7777;
const server = app.listen(PORT, () => {
  console.log("사이트: OPEN\nhttp://localhost:"+PORT);
});

WebSocket(server);