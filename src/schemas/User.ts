import mongoose from "mongoose";

export const UserModel = mongoose.model(
	"User",
	new mongoose.Schema(
		{
			discordId: { type: String, required: true, unique: true },
			country: { type: String, required: true },
			region: String,
			clubs: [
				{
					topic: { type: String, required: true },
					trophies: { type: Number, required: true, default: 0 }, // Global Club Points
					medals: { type: Number, required: true, default: 0 }, // National Club Points
				},
			],
			league: {
				type: {
					_id: false,
					rank: { type: Number, required: true },
					division: { type: Number, required: true },
					group: { type: Number, required: true },
				},
				default: {
					rank: 0,
					division: 0,
					group: 0,
				},
				required: true,
			},
			score: {
				type: {
					_id: false,
					glory: { type: Number, required: true }, // Global Points
					honour: { type: Number, required: true }, // National Points
					prestige: { type: Number, required: true }, // League Points
				},
				default: {
					glory: 0,
					honour: 0,
					prestige: 0,
				},
				required: true,
			},
		},
		{ id: false }
	)
);
