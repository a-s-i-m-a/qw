import { OptionType } from "../../ui/atoms/Select";
import { TabOptions } from "../../ui/organisms/TernaryTabList";
import { Review } from "../types";

export type ReviewExpertPayload = {
    tasteKinds: Record<"first" | "second" | "third", OptionType>;
    lang: TabOptions | OptionType;
    expert?: OptionType;
    user?: OptionType;
    productId?: OptionType;
} & Pick<
    Review,
    | "_id"
    | "tasteScores"
    | "text"
    | "aftertasteDescription"
    | "rating"
    | "aftertasteDuration"
    | "tasteScores"
    | "expertText"
    | "expertAftertasteDescription"
>;
