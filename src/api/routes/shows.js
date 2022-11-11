import express from "express";
import validator from "express-validator";

import { User, Show } from "../../db/models";
import { error, getShow, isId } from "../middleware";

const router = express.Router();

router.get("/", async (req, res) => {
	let where = {};
	let genre = req.query.genre;
	if (genre) {
		where.genre = genre;
	}

	res.send(
		await Show.findAll({
			where: where,
		})
	);
});

router.get("/:showId", isId("showId"), getShow(), (req, res) => {
	res.send(req.show);
});

const vBody = validator.body;

router.patch(
	"/:showId",
	isId("showId"),
	getShow(),
	[
		vBody("rating", "Rating must be a float in the range [0, 5]")
			.optional()
			.isFloat({
				min: 0,
				max: 5,
			})
			.customSanitizer((rating) => Number(Number(rating).toFixed(1))),
		vBody("status", "Status must have a length in the range [5, 25]")
			.optional()
			.isLength({
				min: 5,
				max: 25,
			}),
		vBody("status", "Status must not contain whitespace")
			.optional()
			.custom((value) => {
				return !/\s/g.test(value);
			}),
		error(400),
	],
	async (req, res) => {
		let values = {
			rating: req.body.rating,
			status: req.body.status,
		};

		await req.show.update(values);
		res.sendStatus(200);
	}
);

router.delete("/:showId", isId("showId"), getShow(), async (req, res) => {
	await req.show.destroy();
	res.sendStatus(200);
});

export default router;
