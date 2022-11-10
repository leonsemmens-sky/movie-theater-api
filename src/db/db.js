// imports
import { Sequelize } from "sequelize";
import path from "path";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//create an instance of the database call it db
const db = new Sequelize("database", "username", "password", {
	dialect: "sqlite",
	storage: path.join(__dirname, "movie_watchlist.sqlite"),
	logging: false,
});

//export
export default db;
