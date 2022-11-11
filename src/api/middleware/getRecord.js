import validator from "express-validator";
import error from "./error";

export default function (param, model, options) {
	const key = model.name;
	return [
		validator.param(param).custom(async (id, { req }) => {
			const record = await model.findByPk(id, options);
			req[key] = record;

			if (!record) {
				return Promise.reject(
					`A ${key} with that ${param} does not exist`
				);
			}
		}),
		error(404),
	];
}
