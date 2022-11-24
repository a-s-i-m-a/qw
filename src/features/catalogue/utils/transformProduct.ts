import { OptionsType } from "react-select";
import { OptionType } from "../../../ui/atoms/Select";
import { Gastronomies, PriceType, Product, Wines } from "../../types";
import {
    ACIDITY_OPTIONS,
    AGENT_RATINGS,
    SWEETNESS_OPTIONS,
    TANNIN_OPTIONS
} from "../consts";
import { ProductPayload } from "../types";
import { transformObjectToOption } from "./objectUtils";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatNumber } from "../../utils/formatNumber";

dayjs.extend(customParseFormat);

const gastroOptions = transformObjectToOption(Gastronomies);
const wineOptions = transformObjectToOption(Wines);
export const setEndOfDay = (day: Dayjs) => day.hour(23).minute(59).second(59);

export const discountDateMask = "DD.MM.YYYY";
export const transformProduct = (product: Product): ProductPayload => {
    return {
        ...product,
        // endpoint send "0" as default
        vintage: Number(product.vintage) > 0 ? product.vintage : undefined,
        wineType: wineOptions.find(item => item.value === product.wineType)!,
        manufacturer: product.manufacturer
            ? {
                  label: product.manufacturer?.name,
                  value: product.manufacturer?._id
              }
            : undefined,
        photoId: product.photo?._id,
        region: product.region && {
            value: product.region._id,
            label: product.region.name
        },
        grapeSorts: product.grapeSorts?.map(item => ({
            label: item.name,
            value: item._id
        })),
        wineStyle: product.wineStyle && {
            label: product.wineStyle?.name,
            value: product.wineStyle?._id
        },
        gastronomies:
            product.gastronomies &&
            (gastroOptions.filter(item =>
                product.gastronomies?.includes(item.value)
            ) as OptionsType<OptionType>),
        stockCount: product.stockCount ?? 0,
        country: product.region?.country && {
            label: product.region?.country.name,
            value: product.region?.country._id
        },
        photo: product.photo,
        awardYear: product.awardYear,
        qvinoRating: product.qvinoRating,
        agencyRatings:
            (product.agencyRatings &&
                product.agencyRatings.length > 0 &&
                product.agencyRatings) ||
            AGENT_RATINGS.map(item => ({
                code: item.code,
                rating: item.min
            })),
        bonusInstrument: {
            isEnabled: !!product.hasDoubleBonusPoints,
            type: "bonusPoints"
        },
        discountInstrument: {
            type: "discount",
            isEnabled: product.newPrice
                ? new Date() <= new Date(product.discountEndDate!)
                : false,
            percent: Number(
                formatNumber({
                    value:
                        (1 - product.newPrice?.value / product.price?.value) *
                        100,
                    decimalScale: 2
                })
            ),
            discountPrice: product.newPrice ?? {
                value: 0,
                currency: product.price.currency
            },
            oldNewPrice: product.newPrice,
            oldDate: product.discountEndDate,
            endDate:
                product.discountEndDate !== null
                    ? dayjs(product.discountEndDate).isSame(
                          setEndOfDay(
                              dayjs("01.01.3000", discountDateMask)
                                  .hour(23)
                                  .minute(59)
                                  .second(59)
                          )
                      )
                        ? ""
                        : dayjs(product.discountEndDate).format(
                              discountDateMask
                          )
                    : product.discountEndDate
        },
        reviewInstrument: {
            type: "expertReview",
            isEnabled: !!product.expertReviewId,
            oldReviewId: product.expertReviewId,
            reviewId: product.expertReviewId
                ? {
                      value: product.expertReviewId,
                      label: `${product?.expertReview?.user?.name} (${dayjs(
                          product.expertReview?.createDate
                      ).format("DD.MM.YYYY")})`
                  }
                : undefined
        },
        videoInstrument: {
            type: "expertVideo",
            isEnabled: !!product.videoId,
            oldVideoId: product.videoId,
            videoId: product.videoId
                ? {
                      label: `${product?.video?.expert?.name} (${dayjs(
                          product.video?.createDate
                      ).format("DD.MM.YYYY")})`,
                      value: product.videoId
                  }
                : undefined
        },
        taste: {
            acidity: ACIDITY_OPTIONS.find(
                item => item.value === product.taste?.acidity
            ),
            sweetness: SWEETNESS_OPTIONS.find(
                item => item.value === product.taste?.sweetness
            ),
            tannin: TANNIN_OPTIONS.find(
                item => item.value === product.taste?.tannin
            )
        },
        isSoldByQvino: product.isSoldByQvino ? true : false
    };
};

export const getUpdatedNewDate = (
    isEnabled: boolean,
    oldDate: Product["discountEndDate"],
    newDate: ProductPayload["discountInstrument"]["endDate"]
) => {
    if (
        isEnabled &&
        !setEndOfDay(dayjs(oldDate)).isSame(
            setEndOfDay(dayjs(newDate, discountDateMask))
        )
    ) {
        if (newDate === "") {
            return setEndOfDay(
                dayjs("01.01.3000", discountDateMask)
                    .hour(23)
                    .minute(59)
                    .second(59)
            ).toISOString();
        }
        return setEndOfDay(dayjs(newDate, discountDateMask)).toISOString();
    }
    return undefined;
};
const getUpdatedNewPrice = (
    isEnabled: boolean,
    oldPrice: Product["newPrice"] | null,
    newPrice: ProductPayload["discountInstrument"]["discountPrice"]
) => {
    if (oldPrice && !isEnabled) {
        return {
            value: 0,
            currency: "usd" as PriceType["currency"]
        };
    }
    if (isEnabled && oldPrice?.value !== newPrice?.value) {
        return newPrice;
    }
    return undefined;
};
const getFieldValue = (
    isEnabled: boolean,
    oldId: string | null,
    newId: OptionType | undefined,
    defaultValue: any = undefined
): null | undefined | string => {
    if (oldId && !isEnabled) {
        return null;
    }
    if (isEnabled && oldId !== newId?.value) {
        return newId?.value;
    }
    return defaultValue;
};

export const transformPayload = (
    values: Partial<ProductPayload>
): Partial<Product<true>> => {
    return {
        _id: values._id,
        name: values.name ? { default: values.name } : undefined,
        description: values.description
            ? { default: values.description }
            : undefined,
        wineStyleId: values?.wineStyle?.value,
        grapeSortIds: values?.grapeSorts?.map(i => i.value),
        gastronomies: values?.gastronomies?.map(item => item?.value),
        regionId: values?.region?.value,
        vintage:
            ((values.vintage as unknown) as string | number) === ""
                ? null
                : values.vintage,
        awardYear:
            ((values.awardYear as unknown) as string | number) === ""
                ? null
                : values.awardYear,
        qvinoRating: values.qvinoRating,
        alcoholLevel: values.alcoholLevel === "" ? null : values.alcoholLevel,
        videoUrl: values?.videoUrl,
        photoId: values.photoId,
        manufacturerId: values?.manufacturer?.value,
        volume: values.volume,
        wineType: values.wineType?.value,
        stockCount:
            ((values.stockCount as unknown) as string | number) === ""
                ? null
                : values.stockCount,
        agencyRatings: values.agencyRatings?.map(agency => ({
            code: agency.code,
            rating:
                ((agency.rating as unknown) as string | number) === ""
                    ? 0
                    : agency.rating
        })),
        videoId: getFieldValue(
            values.videoInstrument?.isEnabled!,
            values.videoInstrument?.oldVideoId!,
            values.videoInstrument?.videoId
        ),
        hasDoubleBonusPoints: values.bonusInstrument?.isEnabled,
        price: values.price,
        newPrice: getUpdatedNewPrice(
            values.discountInstrument?.isEnabled!,
            values.discountInstrument?.oldNewPrice!,
            values.discountInstrument?.discountPrice
        ),
        discountEndDate: getUpdatedNewDate(
            values.discountInstrument?.isEnabled!,
            values.discountInstrument?.oldDate!,
            values.discountInstrument?.endDate
        ),

        expertReviewId: getFieldValue(
            values.reviewInstrument?.isEnabled!,
            values.reviewInstrument?.oldReviewId!,
            values.reviewInstrument?.reviewId
        ),
        agingPotential:
            values.agingPotential === "" ? null : values.agingPotential,
        recommendedYear:
            values.recommendedYear === "" ? null : values.recommendedYear,
        altitude: values.altitude === "" ? null : values.altitude,
        taste: values.taste
            ? {
                  tannin: values.taste?.tannin?.value,
                  sweetness: values.taste?.sweetness!.value,
                  acidity: values.taste?.acidity?.value
              }
            : undefined,
        isSoldByQvino: values?.isSoldByQvino ? true : false
    };
};
