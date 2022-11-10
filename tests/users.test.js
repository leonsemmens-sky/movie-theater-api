import request from "supertest";
import app from "../src/api/app";

import seed from "./db/config/seed";
await seed();

describe("Test all of the /users endpoints", () => {
	describe("GET /users", () => {
		it("should respond with an array of users", async () => {});
	});

	describe("GET /users/:userId", () => {
		it("should respond with a user object", async () => {});

		it('should respond with a 404 error for an invalid "userId"', () => {});
	});

	describe("GET /users/:userId/shows", () => {
		it("should respond with all of the user's watched shows", () => {});

		it("should respond with an empty array if the user has no watched shows", () => {});

		it('should respond with a 404 error for an invald "userId"', () => {});
	});

	describe("PUT /users/:userId/shows", () => {
		it("should add the show to the user's watched shows", () => {});

		it('should respond with a 404 error for an invald "userId"', () => {});

		it('should respond with a 400 error when trying to add an invalid "showId"', () => {});
	});
});
