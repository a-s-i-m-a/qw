import { observer } from "mobx-react-lite";
import { FC, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { OptionType, Select } from "../../../../../ui/atoms/Select";
import { useModal } from "../../../../modalpage/hooks";
import { promotionStore } from "../../../store/PromotionStore";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { FetchSelect } from "../../../../catalogue/ui/molecules/FetchSelect";
import { UserAPI } from "../../../../utils/api/requests/user-requests";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { PromosAPI } from "../../../../utils/api/requests/promos-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { TaskPayload } from "../../../types";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { joiResolver } from "@hookform/resolvers/joi";
import { getTaskSchema } from "../../../schemas/TaskSchema";
import { ExpertTask } from "../../../../types";

interface SetTaskModalProps {
    id: string;
}

const taskTypeOptions: OptionType[] = [
    {
        label: "video.plural_0",
        value: "video"
    },
    {
        label: "review.plural_0",
        value: "review"
    }
];

export const PROMOTION_SET_TASK_MODAL = "PROMOTION_SET_TASK_MODAL";

export const SetTaskModal: FC<SetTaskModalProps> = observer(({ id }) => {
    const {
        register,
        activeModalId,
        closeModal,
        modalData,
        modalCallback
    } = useModal<{
        type: ExpertTask["type"];
    }>();
    const { t } = useTranslation();

    const formMethods = useForm({
        mode: "onChange",
        resolver: joiResolver(getTaskSchema(t))
    });
    const { reset, formState } = formMethods;
    const { isDirty, isValid } = formState;
    const { promo } = useContext(promotionStore);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    useEffect(() => {
        if (promo && modalData) {
            reset({
                productId: {
                    label: promo.product.name,
                    value: promo.product._id
                },

                type: {
                    label: t(`${modalData.type}.plural_0`),
                    value: modalData.type
                }
            });
        }

        return () => reset({});
    }, [modalData, promo, reset, t]);
    useEffect(() => {
        if (activeModalId !== id) {
            reset();
        }
    }, [activeModalId, id, reset]);

    const { mutate, isLoading } = useMutation({
        fetchFn: PromosAPI.createTask,
        onSuccess: () => {
            throwSuccessToast(t("taskCreated"), t("taskCreated"));
            const cb = modalCallback[id];
            cb && cb(true);
            closeModal();
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (payload: TaskPayload) => {
        mutate({
            productId: payload.productId.value,
            expertId: payload.expertId.value,
            type: payload.type.value
        });
    };

    if (activeModalId !== id) return null;

    return (
        <FormProvider {...formMethods}>
            <form
                className="w-600p bg-white rounded-20p flex flex-col text-dark-main"
                onSubmit={formMethods.handleSubmit(onSubmit)}
            >
                <h4 className="text-18 font-semibold p-6 mb-25p">
                    {t(`taskCreating`)}
                </h4>

                <section className="grid gap-30p px-25p pb-50p">
                    <FetchSelect
                        fetchFn={CatalogueAPI.getList}
                        placeholder={t("chooseWineName")}
                        label={t("chooseWine")}
                        name="productId"
                        extraArgs={{ isDeleted: false }}
                        isSearchable={true}
                        isDisabled={!!promo}
                    />
                    <Select
                        label={t("taskType")}
                        name="type"
                        defaultOptions={taskTypeOptions}
                        needTranslation={true}
                        placeholder={t("notChosen")}
                        isDisabled={!!promo}
                    />
                    <FetchSelect
                        fetchFn={UserAPI.getList}
                        placeholder={t("choosePerformer")}
                        label={t("performer")}
                        isSearchable={true}
                        name="expertId"
                        extraArgs={{ role: "expert" }}
                    />
                </section>

                <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                    <Button
                        isDisabled={isLoading || !isValid || !isDirty}
                        text={t("setTask")}
                    />

                    <Button
                        text={t("cancel_2")}
                        onClick={closeModal}
                        className="ml-4"
                        htmlType="button"
                        type="tertiary"
                    />
                </div>
            </form>
        </FormProvider>
    );
});
