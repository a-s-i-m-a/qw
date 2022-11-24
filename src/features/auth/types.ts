import { User } from "../types";

export interface LoginResponse {
    sessionId: string;
    user: User;
}
