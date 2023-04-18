import { Router } from "express";
import Country from "../../schemas/Country";
const router = Router();

router
	.route("/")
	.get(async (_req, res) => {
		const data = await Country.find().exec();
		if (data.length === 0) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.post(async (req, res) => {
		const data = await new Country(req.body).save();
		if (data.errors) return res.sendStatus(400);
		else res.status(201).send(data);
	});

router
	.route("/:name")
	.get(async (req, res) => {
		const data = await Country.findOne().where("name", req.params.name).exec();
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await Country.findOne().where("name", req.params.name);
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await Country.findOneAndDelete().where("name", req.params.name).exec();
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

export default router;
