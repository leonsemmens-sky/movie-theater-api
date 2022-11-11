import dotenv from "dotenv";
dotenv.config();

import app from "./api/app";
import seed from "./db/config/seed";

app.post("/seed", async (req, res) => {
	try {
		await seed();
		res.sendStatus(200);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(process.env.PORT, async () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
