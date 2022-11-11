//import our db
import db from "../db";

//import DataTypes
import { DataTypes } from "sequelize";

//Creating a User child class from the Model parent class
const User = db.define("user", {
	username: DataTypes.STRING,
	password: DataTypes.STRING,
});

//export
export default User;
