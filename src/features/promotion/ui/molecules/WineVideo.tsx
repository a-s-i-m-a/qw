import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useCallback, useEffect } from "react";
import { useContext } from "react";
import { useController, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { authStore } from "../../../auth/store/AuthStore";
import { useModal } from "../../../modalpage/hooks";
import { PromosAPI } from "../../../utils/api/requests/promos-requests";
import { useMutation } from "../../../utils/hooks/useMutation";
import { SimpleButton } from "../atoms/SimpleButton";
import { PROMOTION_SET_TASK_MODAL } from "../modals/SetTaskModal";
import { Accordion } from "./Accordion";
import { useHistory } from "react-router-dom";
import { WineSelect } from "./WineSelect";

interface WineVideoProps {
    isEditing: boolean;
    productId?: string;
    hideDisabled?: boolean;
    hideToggle?: boolean;
}
export const WineVideo: FC<WineVideoProps> = observer(
    ({ isEditing, productId, hideDisabled = true, hideToggle }) => {
        const { t } = useTranslation();
        const { openModal, setModalCallback } = useModal();
        const { user } = useContext(authStore);
        const history = useHistory();

        const { mutate, data } = useMutation({
            fetchFn: PromosAPI.getTasks
        });

        const fetchCount = useCallback(() => {
            mutate({
                limit: 0,
                status: "pending|completed",
                type: "video",
                productId,
                bypassCancel: true,
                _fields: ""
            });
        }, [mutate, productId]);
        const handleModalOpen = () => {
            setModalCallback(PROMOTION_SET_TASK_MODAL, (flag: boolean) => {
                flag && fetchCount();
            });
            openModal(PROMOTION_SET_TASK_MODAL, {
                type: "video"
            });
        };
        const {
            field: { value, onChange }
        } = useController({
            name: "videoInstrument.isEnabled"
        });

        useEffect(() => {
            productId && user?.role !== "manufacturer" && fetchCount();
        }, [fetchCount, productId, user?.role]);

        const videoId = useWatch({ name: "videoInstrument.videoId" });
        const openVideo = () => {
            history.push(`/video/${videoId.value}`);
        };

        if (!isEditing && value === false && hideDisabled) {
            return null;
        }
        return (
            <Accordion
                value={value}
                onChange={onChange}
                description={t("promotionFeatures.productTestingVideoMsg")}
                className="mb-20p"
                title={t("expertVideo")}
                isEditing={isEditing}
                hideToggle={hideToggle}
                children={
                    !isEditing && videoId?.value ? (
                        <SimpleButton
                            onClick={openVideo}
                            label={t("video.plural_0")}
                            className="mb-10p"
                        />
                    ) : user?.role !== "manufacturer" && isEditing ? (
                        <section className="w-full flex flex-col">
                            <div className="flex mb-1 justify-between items-center font-semibold text-14 text-gray-text">
                                <p>{t("videoFromSommelier")}</p>
                                <p
                                    className={
                                        data?.totalCount
                                            ? "text-danger"
                                            : undefined
                                    }
                                >{`${t("inWork")}: ${
                                    data?.totalCount ?? 0
                                }`}</p>
                            </div>

                            {productId && (
                                <WineSelect
                                    isEditing={isEditing}
                                    productId={productId}
                                />
                            )}
                            <SimpleButton
                                onClick={handleModalOpen}
                                label={t("setTask")}
                            />
                        </section>
                    ) : undefined
                }
            />
        );
    }
);
