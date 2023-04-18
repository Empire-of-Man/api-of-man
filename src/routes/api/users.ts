import { Router } from "express";
import User from "../../schemas/User";
const router = Router();

router
	.route("/")
	.get(async (_req, res) => {
		const data = await User.find().exec();
		if (data.length === 0) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.post(async (req, res) => {
		const data = await new User(req.body).save();
		if (data.errors) return res.sendStatus(400);
		else res.status(201).send(data);
	});

router
	.route("/:id")
	.get(async (req, res) => {
		const data = await User.findOne().where("id", req.params.id).exec();
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await User.findOne().where("id", req.params.id);
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await User.findOneAndDelete().where("id", req.params.id).exec();
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

export default router;
