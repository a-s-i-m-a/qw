import { OptionsType } from "react-select";
import { OptionType } from "../../ui/atoms/Select";
import { AgentRating, FileType, PriceType, PromoInstrument } from "../types";

export type ProductPayload = {
    _id: string;
    price: PriceType;
    manufacturer?: OptionType;
    name: string;
    wineType: OptionType;
    vintage?: number | null;
    alcoholLevel: number | "" | null;
    volume: number;
    description: string;
    videoUrl: string;
    region: OptionType;
    grapeSorts: OptionsType<OptionType>;
    wineStyle: OptionType;
    gastronomies: OptionsType<OptionType>;
    photoId: string | null;
    photo: FileType | File | string;
    stockCount: number;
    country: OptionType;
    awardYear: number | null;
    qvinoRating: number;
    agencyRatings: AgentRating[];
    altitude: number | null | "";
    recommendedYear: number | null | "";
    agingPotential: number | null | "";
    isSoldByQvino: boolean | null;
    taste: {
        tannin?: OptionType;
        sweetness?: OptionType;
        acidity?: OptionType;
    };
    bonusInstrument: Partial<PromoInstrument>;
    discountInstrument: {
        oldDate: string | null;
        oldNewPrice: PriceType | null;
    } & Partial<PromoInstrument>;
    reviewInstrument: {
        reviewId?: OptionType;
        oldReviewId?: string | null;
    } & Pick<Partial<PromoInstrument>, "type" | "isEnabled">;
    videoInstrument: {
        videoId?: OptionType;
        oldVideoId: string | null;
    } & Pick<Partial<PromoInstrument>, "type" | "isEnabled">;
};
