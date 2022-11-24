import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OptionType, Select } from "../../../../ui/atoms/Select";
import { reviewListForExpertSelect } from "../../../fields/promo";
import { PromosAPI } from "../../../utils/api/requests/promos-requests";
import { getSafariFriendlyDate } from "../../../catalogue/utils/getSafariFriendlyDate";

interface ReviewSelectProps {
    isEditing: boolean;
    productId: string;
}
export const ReviewSelect: FC<ReviewSelectProps> = ({
    isEditing,
    productId
}) => {
    const { t } = useTranslation();

    const fetch = useCallback(
        async (value: string) => {
            const data = await PromosAPI.getReviews({
                q: value,
                productId,
                _fields: reviewListForExpertSelect,
                bypassCancel: true
            });
            return data.items.map(
                review =>
                    ({
                        label: `${review?.user?.name} (${getSafariFriendlyDate(
                            review.createDate
                        ).format("DD.MM.YYYY")})`,
                        value: review._id
                    } as OptionType)
            );
        },
        [productId]
    );

    return (
        <Select
            defaultOptions={true}
            isEditing={isEditing}
            loadOptions={fetch}
            isSearchable={true}
            placeholder={t("notChosen")}
            name="reviewInstrument.reviewId"
            className="mb-20p"
        />
    );
};
