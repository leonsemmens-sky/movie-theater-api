import express from "express";
import validator from "express-validator";
const vBody = validator.body;

import { User, Show } from "../../db/models";
import { error, getShow, isId } from "../middleware";

/**
 * Endpoints:
 *
 * GET    /                       - Get an array of all shows
 * GET    /:showId                - Get a specific show
 * PATCH  /:showId                - Update the status of a show and override the rating
 * DELETE /:showId                - Delete a show
 *
 */

const router = express.Router();

// GET an array of all shows, query allows for a genre
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

// GET a show with the showId
router.get("/:showId", isId("showId"), getShow(), (req, res) => {
	res.send(req.show);
});

// PATCH a new rating and status for the show with showId
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

// DELETE a show with showId
router.delete("/:showId", isId("showId"), getShow(), async (req, res) => {
	await req.show.destroy();
	res.sendStatus(200);
});

export default router;
