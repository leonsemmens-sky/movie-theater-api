//import our db
import db from "../db";

//import DataTypes
import { DataTypes } from "sequelize";

//Creating a User child class from the Model parent class
const Show = db.define("show", {
	title: DataTypes.STRING,
	genre: DataTypes.ENUM("Comedy", "Drama", "Horror", "Sitcom"),
	rating: DataTypes.INTEGER,
	status: DataTypes.STRING,
});

//export
export default Show;
