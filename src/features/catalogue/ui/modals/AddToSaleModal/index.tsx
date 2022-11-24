import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { MoneyInput } from "../../../../../ui/atoms/MoneyInput";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { PriceType, Product } from "../../../../types";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getAddToStoreSchema } from "../../../schemas/AddToStoreSchema";

interface AddToSaleModalModalProps {
    id: string;
}

export const ADD_TO_SALE_MODAL = "ADD_TO_SALE_MODAL";

interface FormData {
    price: PriceType;
    stockCount: number;
}
export const AddToSaleModalModal: FC<AddToSaleModalModalProps> = observer(
    ({ id }) => {
        const {
            register,
            closeModal,
            activeModalId,
            modalCallback,
            modalData
        } = useModal<{
            item: Product;
        }>();

        const { t } = useTranslation();

        useEffect(() => {
            register({
                id
            });
        }, [id, register]);
        const form = useForm<FormData>({
            mode: "onChange",
            resolver: joiResolver(getAddToStoreSchema(t))
        });

        const { handleSubmit, formState, reset, setValue } = form;
        const { isDirty, isValid } = formState;

        useEffect(() => {
            if (activeModalId !== id) {
                reset();
            }
        }, [activeModalId, id, reset]);

        useEffect(() => {
            if (modalData && modalData.item) {
                setValue("price", modalData.item?.price, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                setValue("stockCount", modalData.item?.stockCount ?? 0, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }
        }, [modalData, reset, setValue]);

        const { mutate, isLoading } = useMutation({
            fetchFn: CatalogueAPI.addToStore,
            onSuccess: data => {
                closeModal();
                const cb = modalCallback[id];
                cb && cb(true, data);

                throwSuccessToast(
                    t(`wineIsSelling`),
                    t(`wineIsAddedToShowCase`)
                );
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });

        const onSubmit = (values: FormData) => {
            mutate({
                id: modalData!.item!._id,
                ...values
            });
        };

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t("addiingProductToSale")}
                </h4>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <section className="grid grid-cols-2 gap-10 mt-6 mb-50p px-6">
                            <MoneyInput
                                label={t("price")}
                                name="price"
                                placeholder={t("price")}
                            />
                            <FormInput
                                name="stockCount"
                                defaultValue={0}
                                label={t("stockCount")}
                                isMaskedNumber={true}
                                decimalScale={0}
                                min={0}
                                allowNegative={false}
                                placeholder={"0"}
                            />
                        </section>
                        <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                            <Button
                                text={t("addToStore")}
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
    }
);
