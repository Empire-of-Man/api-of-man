import { Router } from "express";
const router = Router();

router.all("/", (req, res) => res.sendStatus(200));

export default router;
