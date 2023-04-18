import mongoose from "mongoose";

const schema = new mongoose.Schema({
	topic: { type: String, required: true },
	country: { type: String, required: true },
	invite: { type: String, required: true },
});

export default mongoose.model("Club", schema);
