import request from "supertest";
import app from "../src/api/app";
import { User, Show } from "../src/db/models";

import seed from "./db/config/seed";

describe("Test all of the /shows endpoints", () => {
	const api = request(app);

	beforeEach(async () => {
		await seed();
	});

	describe("GET /shows", () => {
		it("should respond with an array of shows", async () => {
			const response = await api.get("/shows");
			const shows = response.body;

			expect(Array.isArray(shows)).toBeTruthy();
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

		it("should respond with an array of shows for a particular genre", async () => {
			const response = await api.get("/shows").query({
				qenre: "Comedy",
			});
			const shows = response.body;

			expect(Array.isArray(shows)).toBeTruthy();
			expect(shows.length).toBe(4);
		});

		it("should respond with an empty array for a genre with no shows", async () => {
			const response = await api.get("/shows").query({
				qenre: "Gary",
			});
			const shows = response.body;

			expect(Array.isArray(shows)).toBeTruthy();
			expect(shows.length).toBe(0);
		});
	});

	describe("GET /shows/:showId", () => {
		it('should respond a show with the "showId"', async () => {
			const response = await api.get("/shows/3");
			const show = response.body;

			expect(show).toEqual(
				expect.objectContaining({
					title: "The Office",
					genre: "Comedy",
					rating: 1,
					status: "on-going",
				})
			);
		});

		it('should respond with a 404 error for an invalid "showId"', async () => {
			const response = await api.get("/shows/63");

			expect(response.statusCode).toBe(404);
		});
	});

	describe("PATCH /shows/:showId", () => {
		it('should update the rating of the show with the "showId"', async () => {
			const response = await api.patch("/shows/5").send({
				rating: 4,
			});

			expect(response.statusCode).toBe(200);
		});

		it("should respond with a 400 error if trying to set the rating to NaN", async () => {
			const response = await api.patch("/shows/6").send({
				rating: "gary",
			});

			expect(response.statusCode).toBe(400);
		});

		it("should respond with a 400 error if trying to set the rating to a number outside the range [0, 5]", async () => {
			const response = await api.patch("/shows/2").send({
				rating: 9000,
			});

			expect(response.statusCode).toBe(400);
		});

		it('should update the status of the show with the "showId"', async () => {
			const response = await api.patch("/shows/1").send({
				status: "ended",
			});

			expect(response.statusCode).toBe(200);
		});

		it("should respond with a 400 error if the status is empty", async () => {
			const response = await api.patch("/shows/7").send({
				status: "",
			});

			expect(response.statusCode).toBe(400);
		});

		it("should respond with a 400 error if the status contains whitespace", async () => {
			const response = await api.patch("/shows/5").send({
				status: "a status",
			});

			expect(response.statusCode).toBe(400);
		});

		it("should respond with a 400 error if the status length is outside the range [5, 25]", async () => {
			const response = await api.patch("/shows/5").send({
				status: "this-is-status-is-too-long",
			});

			expect(response.statusCode).toBe(400);
		});
	});

	describe("DELETE /shows/:showId", () => {
		it('should delete the show with the "showId"', async () => {
			const response = await api.delete("/shows/8");

			expect(response.statusCode).toBe(200);
			expect(
				await Show.findOne({
					where: {
						id: 8,
					},
				})
			).toBeFalsy();
		});

		it('should respond with a 400 error if no show with "showId" exists', async () => {
			const response = await api.delete("/shows/27");

			expect(response.statusCode).toBe(400);
		});
	});
});
