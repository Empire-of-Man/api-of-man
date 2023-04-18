import { Router } from "express";
import League from "../../schemas/League";
const router = Router();

router
	.route("/")
	.get(async (_req, res) => {
		const data = await League.find();
		if (data.length === 0) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.post(async (req, res) => {
		const data = await new League(req.body).save();
		if (data.errors) return res.sendStatus(400);
		else res.status(201).send(data);
	});

router
	.route("/:name")
	.get(async (req, res) => {
		const data = await League.findOne().where("name", req.params.name);
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await League.findOne().where("name", req.params.name);
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await League.findOneAndDelete().where("name", req.params.name);
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

router
	.route("/:name/:division")
	.get(async (req, res) => {
		const data = await League.findOne().where({ name: req.params.name, division: req.params.division });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await League.findOne().where({ name: req.params.name, division: req.params.division });
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await League.findOneAndDelete().where({ name: req.params.name, division: req.params.division });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

router
	.route("/:name/:division/:group")
	.get(async (req, res) => {
		const data = await League.findOne().where({ name: req.params.name, division: req.params.division, group: req.params.group });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	})
	.patch(async (req, res) => {
		const data = await League.findOne().where({ name: req.params.name, division: req.params.division, group: req.params.group });
		if (!data) return res.sendStatus(404);
		if (req.body) res.status(200).json(await data.set(req.body).save());
		else return res.sendStatus(400);
	})
	.delete(async (req, res) => {
		const data = await League.findOneAndDelete().where({ name: req.params.name, division: req.params.division, group: req.params.group });
		if (!data) return res.sendStatus(404);
		else res.status(200).json(data);
	});

export default router;
