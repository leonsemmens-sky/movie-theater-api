import request from "supertest";
import app from "../src/api/app";

import seed from "./db/config/seed";
await seed();

describe("Test all of the /shows endpoints", () => {
	describe("GET /shows", () => {
		it("should respond with an array of shows", () => {});

		it("should respond with an array of shows for a particular genre", () => {});
	});

	describe("GET /shows/:showId", () => {
		it('should respond a show with the "showId"', () => {});

		it('should respond with a 404 error for an invalid "showId"', () => {});
	});

	describe("PATCH /shows/:showId", () => {
		it('should update the rating of the show with the "showId"', () => {});

		it("should respond with a 400 error if trying to set the rating to a non-number", () => {});

		it("should respond with a 400 error if trying to set the rating to a number outside the range [0, 5]", () => {});

		it('should update the status of the show with the "showId"', () => {});

		it("should respond with a 400 error if the status is empty", () => {});

		it("should respond with a 400 error if the status contains whitespace", () => {});

		it("should respond with a 400 error if the status length is outside the range [5, 25]", () => {});
	});

	describe("DELETE /shows/:showId", () => {
		it('should delete the show with the "showId"', () => {});
	});
});
