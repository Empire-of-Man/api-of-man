import { Router } from "express";
import User from "../../../schemas/User";
const router = Router();

router
	.route("/")
	.get(async (_req, res) => {
		const data = await User.find().exec();
		if (data.length === 0) return res.sendStatus(404);
		else res.status(200).json(data);
	})

router
	.route("/:id")
	.get(async (req, res) => {
		const data = await User.findOne().where("id", req.params.id).exec();
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})

export default router;
