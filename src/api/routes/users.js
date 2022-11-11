import express from "express";
import validator from "express-validator";
const vBody = validator.body;

import { getUser, getShow, isId, error } from "../middleware";
import { User, Show, Viewing } from "../../db/models";
import { Op } from "sequelize";

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
		include: Viewing,
	}),
	async (req, res) => {
		const viewings = await req.user.getViewings({
			where: {
				watched: true,
			},
			include: Show,
		});

		const shows = viewings.map((viewing) => viewing.show);
		res.send(shows);
	}
);

router.put(
	"/:userId/shows/:showId",
	isId(["userId", "showId"]),
	getUser(),
	getShow(),
	async (req, res) => {
		await req.user.addShow(req.show, {
			through: {
				watched: true,
			},
		});
		res.sendStatus(202);
	}
);

router.put(
	"/:userId/rate/:showId",
	isId(["userId", "showId"]),
	getUser(),
	getShow(),
	[
		vBody("rating", "Rating must be a float in the range [0, 5]")
			.isFloat({
				min: 0,
				max: 5,
			})
			.customSanitizer((rating) => Number(Number(rating).toFixed(1))),
		error(400),
	],
	async (req, res) => {
		await req.user.addShow(req.show, {
			through: {
				rating: req.body.rating,
			},
		});

		const viewings = await req.show.getViewings({
			where: {
				[Op.not]: {
					rating: null,
				},
			},
		});

		const averageRating =
			viewings.reduce((total, viewing) => total + viewing.rating, 0) /
			viewings.length;
		await req.show.update({
			rating: Number(averageRating.toFixed(1)),
		});

		res.sendStatus(202);
	}
);

export default router;
