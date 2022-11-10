//import dependencies
import { join } from "path"; //helps us find our file easily
import { promises as fs } from "fs"; //helps us get access to promises when dealing with seeding data into our database

//import our database [x]
//import the model that we are trying to import our data into [x]
import db from "../db";
import { Show, User } from "../models";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//write our seed function -> take our json file, create rows with our data into it
const seed = async () => {
	await db.sync({ force: true }); // clear out database + tables

	const showSeedPath = join(__dirname, "shows.json"); //get the path to Show.json file
	const userSeedPath = join(__dirname, "users.json");

	const buffer = await fs.readFile(showSeedPath); //asynchronously reads the content in this file
	const userBuffer = await fs.readFile(userSeedPath);

	const { showsData } = JSON.parse(String(buffer)); // First we convert the data from buffer into a string, then we parse the JSON so it converts from string -> object
	const { usersData } = JSON.parse(String(userBuffer));

	const ShowPromises = showsData.map((show) => Show.create(show)); //creates Show and puts it into our Show table
	const UserPromises = usersData.map((user) => User.create(user));

	//Show.create({'name': 'Tony', 'age': 25})
	await Promise.all(ShowPromises); // The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises.
	await Promise.all(UserPromises);

	console.log("Shows and User database info populated!");
};

//export my seed function
export default seed;
