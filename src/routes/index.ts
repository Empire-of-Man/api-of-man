import { Router } from "express";
const router = Router();

router.all("/", (req, res) => res.send(200));

export default router;
