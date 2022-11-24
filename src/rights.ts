import { Role } from "./features/types";

export const RIGHTS: Record<string, Role[]> = {
    stats: ["admin", "owner", "manufacturer"],
    orders: ["admin", "owner", "manufacturer"],
    giftOrders: ["admin", "owner"],
    users: ["admin", "owner"],
    catalogue: ["manufacturer", "admin", "owner", "moderator"],
    promotion: ["admin", "owner", "manufacturer", "moderator"],
    discounts: ["retailer", "admin", "owner", "moderator"],
    salepoints: ["retailer"],
    gifts: ["admin", "owner"],
    directory: ["admin", "owner", "moderator"],
    tasks: ["admin", "owner", "expert", "moderator"],
    winery: ["manufacturer"],
    certificates: ["admin", "owner", "moderator"]
};
