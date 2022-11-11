//import our db
import db from "../db";

//import DataTypes
import { DataTypes } from "sequelize";

//Creating a User child class from the Model parent class
const Rating = db.define("rating", {
	rating: DataTypes.FLOAT,
});

//export
export default Show;
