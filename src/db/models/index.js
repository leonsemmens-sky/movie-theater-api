import User from "./User";
import Show from "./Show";

User.belongsToMany(Show, { through: "watched" });
Show.belongsToMany(User, { through: "watched" });

export { User, Show };
