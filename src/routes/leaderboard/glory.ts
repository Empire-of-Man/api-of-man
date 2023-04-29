import { Router } from "express";
import { UserModel } from "../../schemas/";
import countriesData from "../../data/countries.json";
const router = Router();

router.get("/users/:id?", async (req, res) => {
	const users = (await UserModel.find().sort({ "score.glory": "desc" })).map((user) => ({ id: user.discordId, glory: user.score.glory }));

	if (!req.params.id) return res.status(200).json(users.slice(0, 10));

	const reqUserIndex = users.findIndex((user) => user.id === req.params.id);
	const responseData = users.slice(reqUserIndex - 1, reqUserIndex + 2).map((user, index) => ({ place: reqUserIndex + index, ...user }));
	res.status(200).json(responseData);
});

router.get("/countries/:name?", async (req, res) => {
	const countries: { name: string; continent?: string; subcontinent?: string; glory: number }[] = [];
	const users = (await UserModel.find()).map((user) => ({ country: user.country, glory: user.score.glory }));

	users.forEach((user) => {
		const country = countries.find((country) => country.name === user.country);
		if (!country) {
			const countryData = countriesData.find((country) => country.name === user.country);
			countries.push({ name: user.country, continent: countryData?.continent, subcontinent: countryData?.subcontinent, glory: user.glory });
		} else country.glory += user.glory;
	});

	countries.sort((a, b) => b.glory - a.glory);

	if (!req.params.name) return res.status(200).json(countries.slice(0, 10));

	const reqCountryIndex = countries.findIndex((country) => country.name === req.params.name);
	const responseData = countries.slice(reqCountryIndex - 1, reqCountryIndex + 2).map((country, index) => ({ place: reqCountryIndex + index, ...country }));
	res.status(200).json(responseData);
});

export default router;
