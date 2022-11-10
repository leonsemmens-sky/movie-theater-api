import dotenv from "dotenv";
dotenv.config();

import app from "./api/app";
import seed from "./db/config/seed";

app.listen(process.env.PORT, async () => {
	await seed();
	console.log(`Listening on port ${process.env.PORT}`);
});
