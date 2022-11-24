import dayjs from "dayjs";
import {
    discountDateMask,
    getUpdatedNewDate,
    setEndOfDay
} from "../../catalogue/utils/transformProduct";
import { Promo, PromoInstrument } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import { PromoPayload } from "../types";

export const transformPromo = (promo: Promo): PromoPayload => {
    const bonusInstrument = promo.instruments.find(
        instr => instr.type === "bonusPoints"
    );
    const discountInstrument = promo.instruments.find(
        instr => instr.type === "discount"
    );
    const videoInstrument = promo.instruments.find(
        instr => instr.type === "expertVideo"
    );
    const reviewInstrument = promo.instruments.find(
        instr => instr.type === "expertReview"
    );

    return {
        productId: promo.product
            ? {
                  value: promo.product._id,
                  label: promo.product.name
              }
            : undefined,
        product: promo.product,
        bonusInstrument: bonusInstrument
            ? { ...bonusInstrument, type: "bonusPoints", isEnabled: true }
            : { type: "bonusPoints", isEnabled: false },
        discountInstrument: {
            type: "discount",
            isEnabled: discountInstrument
                ? new Date() <= new Date(discountInstrument?.endDate ?? 0)
                : false,
            percent: Number(
                formatNumber({
                    value: (1 - 0 / promo.product?.price?.value) * 100,
                    decimalScale: 2
                })
            ),
            discountPrice: discountInstrument?.discountPrice ?? {
                value: 0,
                currency: promo.product?.price?.currency
            },
            endDate:
                discountInstrument?.endDate !== null
                    ? dayjs(discountInstrument?.endDate).isSame(
                          setEndOfDay(
                              dayjs("01.01.3000", discountDateMask)
                                  .hour(23)
                                  .minute(59)
                                  .second(59)
                          )
                      )
                        ? ""
                        : dayjs(discountInstrument?.endDate).format(
                              discountDateMask
                          )
                    : discountInstrument?.endDate
        },
        videoInstrument: videoInstrument
            ? {
                  ...videoInstrument,
                  isEnabled: true,
                  type: "expertVideo",
                  videoId: videoInstrument?.video
                      ? {
                            label: videoInstrument!.video.expert.name,
                            value: videoInstrument!.video._id
                        }
                      : undefined
              }
            : {
                  type: "expertVideo",
                  isEnabled: false
              },
        reviewInstrument: reviewInstrument
            ? {
                  ...bonusInstrument,
                  isEnabled: true,
                  type: "expertReview",
                  reviewId: reviewInstrument.review
                      ? {
                            label: reviewInstrument!.review!.user.name,
                            value: reviewInstrument!.review!._id
                        }
                      : undefined
              }
            : {
                  type: "expertReview",
                  isEnabled: false
              }
    };
};

export const transformPromoPayload = (values: PromoPayload): Partial<Promo> => {
    const bonusInstrument = values.bonusInstrument;

    const discountInstrument = {
        ...values.discountInstrument
    };
    delete discountInstrument["percent"];

    const videoInstrument = values.videoInstrument;
    const reviewInstrument = values.reviewInstrument;

    let instruments = [] as Partial<PromoInstrument>[];
    if (discountInstrument.isEnabled) {
        instruments.push({
            discountPrice: discountInstrument.discountPrice,
            endDate: getUpdatedNewDate(
                true,
                null,
                discountInstrument.endDate ?? ""
            ),
            type: "discount"
        });
    }
    if (bonusInstrument.isEnabled) {
        instruments.push(bonusInstrument);
    }
    if (videoInstrument.isEnabled) {
        instruments.push({
            ...videoInstrument,
            videoId: videoInstrument.videoId?.value
        });
    }
    if (reviewInstrument.isEnabled) {
        instruments.push({
            ...reviewInstrument,
            reviewId: reviewInstrument.reviewId?.value
        });
    }
    instruments = instruments.map(({ isEnabled, ...rest }) => rest);

    return {
        productId: values.productId?.value,
        instruments
    };
};
