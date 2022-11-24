import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OptionType, Select } from "../../../../ui/atoms/Select";
import { videoListForExpertSelect } from "../../../fields/promo";
import { PromosAPI } from "../../../utils/api/requests/promos-requests";
import { getSafariFriendlyDate } from "../../../catalogue/utils/getSafariFriendlyDate";

interface WineSelectProps {
    isEditing: boolean;
    productId: string;
}
export const WineSelect: FC<WineSelectProps> = ({ isEditing, productId }) => {
    const { t } = useTranslation();

    const fetch = useCallback(
        async (value: string) => {
            const data = await PromosAPI.getVideos({
                q: value,
                productId,
                _fields: videoListForExpertSelect,
                bypassCancel: true
            });
            return data.items.map(
                video =>
                    ({
                        label: `${video?.expert?.name} (${getSafariFriendlyDate(
                            video.createDate
                        ).format("DD.MM.YYYY")})`,
                        value: video._id
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
            name="videoInstrument.videoId"
            className="mb-20p"
        />
    );
};
