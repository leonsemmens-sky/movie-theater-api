import User from "./User";
import Show from "./Show";
import Viewing from "./Viewing";

User.belongsToMany(Show, { through: Viewing });
Show.belongsToMany(User, { through: Viewing });

User.hasMany(Viewing);
Viewing.belongsTo(User);

Show.hasMany(Viewing);
Viewing.belongsTo(Show);

export { User, Show, Viewing };
