import { Router } from "express";
import { UserModel } from "../../schemas/";
const router = Router();

router.get("/users/:id?", async (req, res) => {
	const { club: clubTopic, country } = req.query;
	if (!clubTopic || !country) return res.sendStatus(400);

	const users = (
		await UserModel.find()
			.where("clubs", { $elemMatch: { topic: { $eq: clubTopic } } })
			.where("country", { $eq: country })
	)
		.map((user) => ({
			id: user.discordId,
			region: user.region,
			medals: user.clubs.find((club) => club.topic === clubTopic)!.medals,
		}))
		.sort((a, b) => b.medals - a.medals);

	if (!req.params.id) return res.status(200).json(users.slice(0, 10));

	const reqUserIndex = users.findIndex((user) => user.id === req.params.id);
	const responseData = users.slice(reqUserIndex - 1, reqUserIndex + 2).map((user, index) => ({ place: reqUserIndex + index, ...user }));
	res.status(200).json(responseData);
});

router.get("/localClubs/:region?", async (req, res) => {
	const { club: clubTopic, country } = req.query;
	if (!clubTopic || !country) return res.sendStatus(400);

	const localClubs: { region: string; medals: number }[] = [];

	const users = (
		await UserModel.find()
			.where("clubs", { $elemMatch: { topic: { $eq: clubTopic } } })
			.where("country", { $eq: country })
	).map((user) => ({
		region: user.region,
		medals: user.clubs.find((club) => club.topic === clubTopic)!.medals,
	}));

	users.forEach((user) => {
		const club = localClubs.find((club) => club.region === (user.region ? user.region : `${country} Regions`));
		if (!club) localClubs.push({ region: user.region ? user.region : `${country} Regions`, medals: user.medals });
		else club.medals += user.medals;
	});

	localClubs.sort((a, b) => b.medals - a.medals);

	if (!req.params.region) return res.status(200).json(localClubs.slice(0, 10));

	const reqClubIndex = localClubs.findIndex((club) => club.region === req.params.region);
	const responseData = localClubs.slice(reqClubIndex - 1, reqClubIndex + 2).map((club, index) => ({ place: reqClubIndex + index, ...club }));
	res.status(200).json(responseData);
});

export default router;
