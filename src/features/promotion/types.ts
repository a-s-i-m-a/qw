import { OptionType } from "../../ui/atoms/Select";
import { Product, PromoInstrument } from "../types";

export interface TaskPayload {
    expertId: {
        value: string;
    };

    productId: {
        value: string;
    };

    type: {
        value: "video" | "review";
    };
}

export interface PromoPayload {
    productId?: OptionType;
    product?: Product;

    bonusInstrument: Partial<PromoInstrument>;
    discountInstrument: Partial<PromoInstrument>;
    reviewInstrument: {
        reviewId?: OptionType;
    } & Pick<Partial<PromoInstrument>, "type" | "isEnabled">;
    videoInstrument: {
        videoId?: OptionType;
    } & Pick<Partial<PromoInstrument>, "type" | "isEnabled">;
}
