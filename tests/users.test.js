import request from "supertest";
import app from "../src/api/app";
import { User, Show, Viewing } from "../src/db/models";

import seed from "../src/db/config/seed";

describe("Test all of the /users endpoints", () => {
	const api = request(app);

	beforeEach(async () => {
		await seed();
	});

	describe("GET /users", () => {
		it("should respond with an array of users", async () => {
			const response = await api.get("/users");
			const users = response.body;

			expect(Array.isArray(users)).toBeTruthy();
			users.forEach((user) => {
				expect(Object.keys(user)).toEqual(
					expect.arrayContaining(["username", "password"])
				);
			});
		});
	});

	describe("GET /users/:userId", () => {
		it("should respond with a user object", async () => {
			const response = await api.get("/users/1");
			const user = response.body;

			expect(user).toEqual(
				expect.objectContaining({
					username: "testUser@gmail.com",
					password: "ThisIsA",
				})
			);
		});

		it('should respond with a 400 error for a "userId" which is NaN', async () => {
			const response = await api.get("/users/hi");

			expect(response.statusCode).toBe(400);
		});

		it('should respond with a 404 error for an invalid "userId"', async () => {
			const response = await api.get("/users/10");

			expect(response.statusCode).toBe(404);
		});
	});

	describe("GET /users/:userId/shows", () => {
		it("should respond with all of the user's watched shows", async () => {
			const user = await User.findByPk(1);
			await user.addShows(
				await Show.findAll({
					limit: 5,
				}),
				{
					through: {
						watched: true,
					},
				}
			);

			const response = await api.get("/users/1/shows");
			const shows = response.body;

			expect(Array.isArray(shows)).toBeTruthy();
			expect(shows.length).toBe(5);
			shows.forEach((show) => {
				expect(Object.keys(show)).toEqual(
					expect.arrayContaining([
						"title",
						"genre",
						"rating",
						"status",
					])
				);
			});
		});

		it("should respond with an empty array if the user has no watched shows", async () => {
			const response = await api.get("/users/2/shows");
			const shows = response.body;

			expect(Array.isArray(shows)).toBeTruthy();
			expect(shows.length).toBe(0);
		});

		it('should respond with a 404 error for an invalid "userId"', async () => {
			const response = await api.get("/users/7/shows");

			expect(response.statusCode).toBe(404);
		});
	});

	describe("PUT /users/:userId/shows/:showId", () => {
		it("should add the show to the user's watched shows", async () => {
			const response = await api.put("/users/2/shows/2");

			expect(response.statusCode).toBe(202);
		});

		it('should respond with a 400 error if "showId" is NaN', async () => {
			const response = await api.put("/users/2/shows/steve");

			expect(response.statusCode).toBe(400);
		});

		it('should respond with a 404 error when trying to add an invalid "showId"', async () => {
			const response = await api.put("/users/2/shows/26");

			expect(response.statusCode).toBe(404);
		});

		it('should respond with a 404 error for an invalid "userId"', async () => {
			const response = await api.put("/users/9/shows/1");

			expect(response.statusCode).toBe(404);
		});
	});

	describe("PUT /users/:userId/rate/:showId", () => {
		it("should add a rating to the show", async () => {
			const response = await api.put("/users/1/rate/2").send({
				rating: 4,
			});

			expect(response.statusCode).toBe(202);

			const show = await Show.findByPk(2);
			expect(
				await show.getViewings({
					where: {
						userId: 1,
						rating: 4,
					},
				})
			).toBeTruthy();
		});

		it("should respond with a 400 error if trying to set the rating to NaN", async () => {
			const response = await api.put("/users/1/rate/7").send({
				rating: "gary",
			});

			expect(response.statusCode).toBe(400);
		});

		it("should respond with a 400 error if trying to set the rating to a number outside the range [0, 5]", async () => {
			const response = await api.put("/users/1/rate/3").send({
				rating: 9000,
			});

			expect(response.statusCode).toBe(400);
		});

		it('should respond with a 400 error if "showId" is NaN', async () => {
			const response = await api.put("/users/2/rate/steve");

			expect(response.statusCode).toBe(400);
		});

		it('should respond with a 404 error when trying to add an invalid "showId"', async () => {
			const response = await api.put("/users/2/rate/26");

			expect(response.statusCode).toBe(404);
		});

		it('should respond with a 404 error for an invalid "userId"', async () => {
			const response = await api.put("/users/9/rate/1");

			expect(response.statusCode).toBe(404);
		});
	});
});
