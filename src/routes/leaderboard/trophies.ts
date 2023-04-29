import { Router } from "express";
import { UserModel } from "../../schemas/";
import countriesData from "../../data/countries.json";
const router = Router();

router.get("/users/:id?", async (req, res) => {
	const clubTopic = req.query.club;
	if (!clubTopic) return res.sendStatus(400);

	const users = (await UserModel.find().where("clubs", { $elemMatch: { topic: { $eq: clubTopic } } }))
		.map((user) => ({
			id: user.discordId,
			trophies: user.clubs.find((club) => club.topic === clubTopic)!.trophies,
		}))
		.sort((a, b) => b.trophies - a.trophies);

	if (!req.params.id) return res.status(200).json(users.slice(0, 10));

	const reqUserIndex = users.findIndex((user) => user.id === req.params.id);
	const responseData = users.slice(reqUserIndex - 1, reqUserIndex + 2).map((user, index) => ({ place: reqUserIndex + index, ...user }));
	res.status(200).json(responseData);
});

router.get("/nationalClubs/:country?", async (req, res) => {
	const clubTopic = req.query.club;
	if (!clubTopic) return res.sendStatus(400);

	const nationalClubs: { country: string; continent?: string; subcontinent?: string; trophies: number }[] = [];

	const users = (await UserModel.find().where("clubs", { $elemMatch: { topic: { $eq: clubTopic } } })).map((user) => ({
		country: user.country,
		trophies: user.clubs.find((club) => club.topic === clubTopic)!.trophies,
	}));

	users.forEach((user) => {
		const club = nationalClubs.find((club) => club.country === user.country);
		if (!club) {
			const countryData = countriesData.find((country) => country.name === user.country);
			nationalClubs.push({ country: user.country, continent: countryData?.continent, subcontinent: countryData?.subcontinent, trophies: user.trophies });
		} else club.trophies += user.trophies;
	});

	nationalClubs.sort((a, b) => b.trophies - a.trophies);

	if (!req.params.country) return res.status(200).json(nationalClubs.slice(0, 10));

	const reqClubIndex = nationalClubs.findIndex((club) => club.country === req.params.country);
	const responseData = nationalClubs.slice(reqClubIndex - 1, reqClubIndex + 2).map((club, index) => ({ place: reqClubIndex + index, ...club }));
	res.status(200).json(responseData);
});

export default router;
