import { Router } from "express";
import { UserModel } from "../../schemas/";
const router = Router();

router.get("/users/:id?", async (req, res) => {
	const { division, rank } = req.query;
	if (!division || !rank) return res.sendStatus(400);
	const users = (await UserModel.find().where("league.division", { $eq: division }).where("league.rank", { $eq: rank }).sort({ "score.prestige": "desc" })).map(
		(user) => ({
			id: user.discordId,
			prestige: user.score.prestige,
		})
	);

	if (!req.params.id) return res.status(200).json(users.slice(0, 10));

	const reqUserIndex = users.findIndex((user) => user.id === req.params.id);
	const responseData = users.slice(reqUserIndex - 1, reqUserIndex + 2).map((user, index) => ({ place: reqUserIndex + index, ...user }));
	res.status(200).json(responseData);
});

export default router;
