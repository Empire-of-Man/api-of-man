import { Router } from "express";
import { UserModel } from "../schemas";
const router = Router();

router
	.route("/:discordId")
	.get(async (req, res) => {
		const data = await UserModel.findOne().where("discordId", { $eq: req.params.discordId });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await UserModel.findOne().where("discordId", { $eq: req.params.discordId });
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await UserModel.findOneAndDelete().where("discordId", { $eq: req.params.discordId });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

export default router;
