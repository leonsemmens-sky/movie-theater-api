import { Show } from "../../db/models";
import getRecord from "./getRecord";

export default function (options) {
	return getRecord("showId", Show, options);
}
