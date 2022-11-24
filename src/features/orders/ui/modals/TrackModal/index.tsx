import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { throwErrorToast } from "../../../../../ui/organisms/Toaster";
import { authStore } from "../../../../auth/store/AuthStore";
import { getFields } from "../../../../fields/orders";
import { useModal } from "../../../../modalpage/hooks";
import { Order } from "../../../../types";
import { OrdersAPI } from "../../../../utils/api/requests/order-request";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface TrackModalProps {
    id: string;
}

export const TRACK_EDIT_MODAL = "TRACK_EDIT_MODAL";

export const TrackModal: FC<TrackModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: Order;
    }>();
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    const form = useForm<Order>({
        mode: "onChange",
        resolver: joiResolver(
            Joi.object({
                trackNumber: Joi.string()
                    .required()
                    .messages({
                        "string.base": t("fieldIsRequired"),
                        "string.empty": t("fieldIsRequired"),
                        "any.required": t("fieldIsRequired")
                    })
            }).unknown()
        )
    });
    const { handleSubmit, formState, reset } = form;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                trackNumber: ""
            });
        }
        if (modalData?.item?.trackNumber) {
            reset({
                trackNumber: modalData?.item?.trackNumber
            });
        }
    }, [activeModalId, id, reset, modalData]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { isDirty, isValid } = formState;

    const { mutate, isLoading } = useMutation({
        fetchFn:
            modalData?.item?.status === "processing"
                ? OrdersAPI.changeStatus
                : OrdersAPI.updateOrder,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: Order) => {
        if (modalData?.item?.status === "processing") {
            mutate({
                id: modalData?.item?._id || "",
                status: "sent",
                trackNumber: values.trackNumber,
                role: user?.role === "manufacturer" ? "manufacturer" : "admin",
                _fields: getFields()
            });
        } else {
            mutate({
                id: modalData?.item?._id || "",
                status: "sent",
                trackNumber: values.trackNumber,
                _fields: getFields()
            });
        }
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t(`orders.trackModalTitle`)}
            </h4>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        name="trackNumber"
                        label={t("orders.trackNumber")}
                        className="mt-6 px-6 mb-12 w-full"
                    />
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={t("confirm")}
                            isDisabled={!isValid || !isDirty || isLoading}
                        />
                        <Button
                            text={t("cancel_2")}
                            type="tertiary"
                            className="ml-4"
                            htmlType="button"
                            onClick={closeModal}
                        />
                    </div>
                </form>
            </FormProvider>
        </section>
    );
});
