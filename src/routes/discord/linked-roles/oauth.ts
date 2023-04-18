import { Router } from "express";
import { env } from "process";
const router = Router();

router.get("/", async (req, res) => {
	if (req.signedCookies.clientState !== req.query["state"] || !req.query["code"]) return res.sendStatus(403);

	const tokens = await fetch("https://discord.com/api/v10/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: env.DISCORD_CLIENT_ID!,
			client_secret: env.DISCORD_CLIENT_SECRET!,
			grant_type: "authorization_code",
			code: req.query["code"] as string,
			redirect_uri: `https://${req.hostname}/${env.DISCORD_LR_OAUTH_URI}`,
		}),
	}).then(async (response) => {
		if (response.ok) return response.json();
		else throw new Error(`Error fetching OAuth tokens: ${new TextDecoder().decode((await response.body?.getReader().read())!.value)}`);
	});

	await fetch(`https://discord.com/api/v10/users/@me/applications/${env.DISCORD_CLIENT_ID}/role-connection`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ platform_name: "Empire of Man Linked Roles" }),
	}).then((response) => {
		if (!response.ok) throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
		else res.sendStatus(200);
	});
});

export default router;
