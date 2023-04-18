import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
	name: { type: String, required: true },
	userIds: { type: [String] },
});

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	division: { type: Number, required: true },
	groups: { type: [groupSchema], required: true },
});

export default mongoose.model("League", schema);
