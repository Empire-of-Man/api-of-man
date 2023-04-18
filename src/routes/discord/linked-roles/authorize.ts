import { Router } from "express";
import { env } from "process";
const router = Router();

router.get("/", (req, res) => {
	const state = crypto.randomUUID();
	const query = new URLSearchParams({
		client_id: env.DISCORD_CLIENT_ID!,
		response_type: "code",
		state: state,
		redirect_uri: `https://${req.hostname}/${env.DISCORD_LR_OAUTH_URI}`,
		scope: "role_connections.write identify",
		prompt: "consent",
	});

	res.cookie("clientState", state, { maxAge: 1000 * 60 * 5, signed: true });
	res.redirect(`https://discord.com/api/oauth2/authorize?${query.toString()}`);
});

export default router;
