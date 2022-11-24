import { OptionType } from "../../../ui/atoms/Select";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { Languages, Review, Taste, User } from "../../types";
import { ReviewExpertPayload } from "../types";

export const transformReviewPayload = (
    data: ReviewExpertPayload
): Partial<Review> => {
    const values = Object.fromEntries(
        Object.entries(data).filter(entry => entry[1] !== null)
    ) as ReviewExpertPayload;
    return {
        tasteKinds: Object.entries(values.tasteKinds).reduce(
            (prev, cur) => ({ ...prev, [cur[0]]: cur[1].value }),
            {} as Record<"first" | "second" | "third", Taste>
        ),
        tasteScores: values.tasteScores,
        aftertasteDuration: values.aftertasteDuration,
        aftertasteDescription: values.aftertasteDescription,
        expertText: values.expertText,
        expertAftertasteDescription: values.expertAftertasteDescription,
        rating: values.rating,
        text: values.text,
        lang: values.lang.value,
        productId: values.productId?.value,
        userId: values.expert ? values.expert.value : values.user?.value,
        _id: values._id
    };
};

export const transformReview = (
    review: Review,
    expert: User,
    isTaskAccepting = false
): ReviewExpertPayload => {
    const language = review.text ? "en" : ((review?.lang ?? "en") as Languages);

    return {
        ...review,
        lang: langTabs.find(lang => lang.value === language)!,
        expertText: isTaskAccepting
            ? {
                  ...review.expertText,
                  [language]: review?.expertText?.[language] ?? review.text
              }
            : review.expertText,
        expertAftertasteDescription: isTaskAccepting
            ? {
                  ...review.expertAftertasteDescription,
                  [language]:
                      review?.expertAftertasteDescription?.[language] ??
                      review.aftertasteDescription
              }
            : review.expertAftertasteDescription,
        tasteKinds: Object.entries(review.tasteKinds).reduce(
            (prev, cur) => ({
                ...prev,
                [cur[0]]: {
                    value: cur[1],
                    label: cur[1]
                }
            }),
            {} as Record<"first" | "second" | "third", OptionType>
        ),
        expert: expert ? { label: expert.name, value: expert._id } : undefined,
        user: expert ? { label: expert.name, value: expert._id } : undefined,
        productId: review.product
            ? { label: review.product.name, value: review.product._id }
            : undefined,
        _id: review._id
    };
};
