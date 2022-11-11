//import our db
import db from "../db";

//import DataTypes
import { DataTypes, Model } from "sequelize";

//Creating a User child class from the Model parent class
const Viewing = db.define("viewing", {
	rating: DataTypes.FLOAT,
	watched: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

//export
export default Viewing;
