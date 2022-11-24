import { OptionType } from "../../ui/atoms/Select";
import { FileType, Role } from "../types";

export type UserPayload = {
    name: string;
    phone: string;
    login: string;
    country?: OptionType | null;
    manufacturer?: OptionType | null;
    retailer?: OptionType | null;
    photo: FileType | null;
    photoId?: string | null;
    role: Role;
    _id?: string;
};

export interface UserSectionProps {
    isMe: boolean;
}
