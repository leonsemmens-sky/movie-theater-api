import express from "express";
import validator from "express-validator";
const vBody = validator.body;

import { getUser, getShow, isId, error } from "../middleware";
import { User, Show, Viewing } from "../../db/models";
import { Op } from "sequelize";

/**
 * Endpoints:
 *
 * GET    /                       - Get an array of all users
 * POST   /                       - Add a new user
 * GET    /:userId                - Get a specific user
 * DELETE /:userId                - Delete a specific user
 * GET    /:userId/shows          - Get a user's watched shows
 * PUT    /:userId/shows/:showId  - Add a show to the user's watched shows
 * PUT    /:userId/rate/:showId   - For a user to rate a show
 *
 */

const router = express.Router();

// GET an array of all users
router.get("/", async (req, res) => {
	res.send(await User.findAll());
});

// POST a new user and add it to the database
router.post(
	"/",
	[
		vBody("username", "Username must be an email")
			.normalizeEmail()
			.isEmail(),
		vBody("password", "Password must be atleast 8 characters").isLength({
			min: 8,
		}),
		error(400),
	],
	async (req, res) => {
		const user = await User.create({
			username: req.body.username,
			password: req.body.password,
		});
		res.status(201).send(user);
	}
);

// DELETE a user with the userId
router.delete("/:userId", isId("userId"), getUser(), async (req, res) => {
	await req.user.destroy();
	res.sendStatus(200);
});

// GET a user with the userId
router.get("/:userId", isId("userId"), getUser(), (req, res) => {
	res.send(req.user);
});

// GET all of the shows that a user has watched
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

// PUT a show into a user's watched shows
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

// PUT a rating for a show from the user
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
