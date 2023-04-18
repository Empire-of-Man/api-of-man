import mongoose from "mongoose";

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	invite: { type: String, required: true },
	continent: { type: String, required: true },
	subcontinent: { type: String, required: true },
	regions: [String]
});

export default mongoose.model("Country", schema);
