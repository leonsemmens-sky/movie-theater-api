import express from "express";

import { getUser, getShow, isId } from "../middleware";
import { User, Show } from "../../db/models";

const router = express.Router();

router.get("/", async (req, res) => {
	res.send(await User.findAll());
});

router.get("/:userId", isId("userId"), getUser(), (req, res) => {
	res.send(req.user);
});

router.get(
	"/:userId/shows",
	isId("userId"),
	getUser({
		include: Show,
	}),
	(req, res) => {
		res.send(req.user.shows);
	}
);

router.put(
	"/:userId/shows/:showId",
	isId(["userId", "showId"]),
	getUser(),
	getShow(),
	async (req, res) => {
		await req.user.addShow(req.show);
		res.sendStatus(202);
	}
);

export default router;
