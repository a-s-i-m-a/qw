import { reduceList } from "../utils/reduceList";

const fields = [
    "name",
    "role",
    { photo: ["url"] },
    "photoId",
    "email",
    "login",
    "phone",
    "isBlocked",
    { manufacturer: ["name", "articleId"] },
    { country: ["name"] },
    "retailer",
    "balances",
    "createDate"
];
export const userFields = reduceList(fields);

export const userSessionID = reduceList(["sessionId", { user: ["role"] }]);
