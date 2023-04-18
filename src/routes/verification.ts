import { Router } from "express";
import { env } from "process";
const router = Router();

router.get("/", (req, res) => res.redirect(`https://${req.hostname}/${env.DISCORD_LR_AUTHORIZE_URI}`));

export default router;
