import { OptionType } from "../../ui/atoms/Select";
import { TabOptions } from "../../ui/organisms/TernaryTabList";
import { Quiz, Video } from "../types";

export type VideoPayload = {
    expert?: OptionType;
    quiz: Partial<Quiz>;
    links: Video["links"];
    currentLang: TabOptions;
    productId?: OptionType;
    _id: string;
};
