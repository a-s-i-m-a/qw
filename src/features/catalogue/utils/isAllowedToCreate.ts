import { Role } from "../../types";

export const isAllowedToCreate = (role?: Role) =>
    role && ["admin", "owner"].includes(role);
