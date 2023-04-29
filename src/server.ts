import { PORT } from "./config";
import { cleanEnv, str } from "envalid";
import logger from "./logger";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

export const env = cleanEnv(process.env, {
	COOKIE_SECRET: str(),
	API_KEY: str(),
	NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});

mongoose
	.connect("mongodb://127.0.0.1:27017/database")
	.then(() => logger.info("MongoDB connected"))
	.catch((err) => {
		throw err;
	});

const app = express();
app.use(cors(), express.json(), express.urlencoded({ extended: true }), cookieParser(env.COOKIE_SECRET));

app.use((req, res, next) => {
	if (req.get("Authorization") === `Bearer ${env.API_KEY}`) next();
	else res.sendStatus(401);
});

listNestedFiles(path.join(__dirname, "routes"), ".js").forEach(async (filePath) => {
	const router = (await import(filePath)).default;
	if (!router) return logger.warn(`Missing router at ${filePath}`);
	const routePath = path.parse(filePath.split("routes", 2)[1]);
	app.use(path.join(routePath.dir, routePath.name === "index" ? "" : routePath.name), router);
});

app
	.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
	.on("request", (req) => logger.info(req))
	.on("error", (err) => {
		throw err;
	});

function listNestedFiles(dirPath: string, extension: string, files: string[] = []) {
	fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
		const entryPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) listNestedFiles(entryPath, extension, files);
		else {
			if (path.parse(entryPath).ext !== extension) return;
			else files.push(entryPath);
		}
	});
	return files;
}
