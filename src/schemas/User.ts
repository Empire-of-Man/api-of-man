import mongoose from "mongoose";

const schema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	country: { type: String, required: true },
	region: String,
	clubs: [String],
	leagues: {
		type: {
			_id: false,
			league: { type: Number, required: true },
			division: { type: Number, required: true },
			group: { type: Number, required: true },
		},
		default: {
			league: 0,
			division: 0,
			group: 0,
		},
		required: true,
	},
	points: {
		type: {
			_id: false,
			global: { type: Number, required: true },
			national: { type: Number, required: true },
			globalClub: { type: Number, required: true },
			nationalClub: { type: Number, required: true },
			league: { type: Number, required: true },
		},
		default: {
			global: 0,
			national: 0,
			globalClub: 0,
			nationalClub: 0,
			league: 0,
		},
		required: true,
	},
});

export default mongoose.model("User", schema);
