import { User } from "../../db/models";
import getRecord from "./getRecord";

export default function (options) {
	return getRecord("userId", User, options);
}
