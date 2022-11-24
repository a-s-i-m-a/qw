import { OptionType } from "../../ui/atoms/Select";
import { TabOptions } from "./../../ui/organisms/TernaryTabList/index";
import { FileType, LangMap, PriceType } from "./../types";

export type GiftPayload<useLangMap extends boolean = true> = {
    _id?: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    description: useLangMap extends true ? Partial<LangMap> : string;
    price: PriceType;
    saleStatus: "inSale" | "none";
    photo: FileType;
    photoId?: string | null;
    stockCount: number;
    createDate: string;
    lang: TabOptions | OptionType;
    pricePoints: number;
};