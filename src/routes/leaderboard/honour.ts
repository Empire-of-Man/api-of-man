import { Router } from "express";
import { UserModel } from "../../schemas/";
const router = Router();

router.get("/users/:id?", async (req, res) => {
	const country = req.query.country;
	if (!country) return res.sendStatus(400);

	const users = (await UserModel.find().where("country", { $eq: country }).sort({ "score.honour": "desc" })).map((user) => ({
		id: user.discordId,
		region: user.region,
		honour: user.score.honour,
	}));

	if (!req.params.id) return res.status(200).json(users.slice(0, 10));

	const reqUserIndex = users.findIndex((user) => user.id === req.params.id);
	const responseData = users.slice(reqUserIndex - 1, reqUserIndex + 2).map((user, index) => ({ place: reqUserIndex + index, ...user }));
	res.status(200).json(responseData);
});

router.get("/regions/:name?", async (req, res) => {
	const country = req.query.country;
	if (!country) return res.sendStatus(400);

	const regions: { name: string; honour: number }[] = [];
	const users = (await UserModel.find().where("country", { $eq: country })).map((user) => ({
		region: user.region,
		honour: user.score.honour,
	}));

	users.forEach((user) => {
		const region = regions.find((region) => region.name === (user.region ? user.region : `${country} Regions`));
		if (!region) regions.push({ name: user.region ? user.region : `${country} Regions`, honour: user.honour });
		else region.honour += user.honour;
	});

	regions.sort((a, b) => b.honour - a.honour);

	if (!req.params.name) return res.status(200).json(regions.slice(0, 10));

	const reqRegionIndex = regions.findIndex((region) => region.name === req.params.name);
	const responseData = regions.slice(reqRegionIndex - 1, reqRegionIndex + 2).map((region, index) => ({ place: reqRegionIndex + index, ...region }));
	res.status(200).json(responseData);
});

export default router;
