import { Show } from "./Show";
import { User } from "./User";

User.hasMany(Show);
Show.belongsTo(User);

export { Show, User };
