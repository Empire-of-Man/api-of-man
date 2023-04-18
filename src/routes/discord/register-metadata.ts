import dotenv from "dotenv";
dotenv.config();

import { env } from "process";
import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
	fetch(`https://discord.com/api/v10/applications/${env.DISCORD_CLIENT_ID}/role-connections/metadata`, {
		method: "PUT",
		body: JSON.stringify([]),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${env.DISCORD_TOKEN}`,
		},
	}).then((response) => {
		if (response.ok) res.sendStatus(200);
		else res.sendStatus(400);
	});
});

export default router;
