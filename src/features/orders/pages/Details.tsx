import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { dirtyValuesRecursive } from "../../utils/getDirtyFields";
import { ordersStore } from "../store/OrdersStore";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { AddressSection } from "../ui/organisms/AddressSection";
import { OrderedProducts } from "../ui/organisms/OrderedProducts";
import { Languages, Order } from "../../types";
import { transformItems, transformOrder, transformPayload } from "../utils/transform";
import { joiResolver } from "@hookform/resolvers/joi";
import { getOrderSchema } from "../../utils/schemas/OrderSchema";
import { authStore } from "../../auth/store/AuthStore";

export const Details = observer(() => {
    const { id } = useParams<Record<"id", string>>();
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const { user } = useContext(authStore);
    const {
        order,
        items,
        isEditing,
        setEditing,
        loadOrder,
        updateOrder,
        clear
    } = useContext(ordersStore);
    const formMethods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
        resolver: joiResolver(getOrderSchema(t))
    });
    const { formState, handleSubmit, reset } = formMethods;
    const { dirtyFields } = formState;

    useEffect(() => {
        user && loadOrder(id, user.role);
    }, [loadOrder, id, i18n, user]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        if (order) {
            reset(transformOrder(order, i18n.language as Languages));
        }
    }, [reset, order, i18n]);

    const onSubmit = async (values: Order) => {
        try {
            const formData = transformPayload({
                ...dirtyValuesRecursive({ ...dirtyFields }, { ...values }),
                items: transformItems(items)
            });
            const updatedOrder = await updateOrder({
                ...formData
            });
            throwSuccessToast(t("changesSaved"), t("changesSavedSuccessfully"));
            history.push(`/orders/${updatedOrder?._id}`);
            setEditing(false);
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    if (!order) {
        return <PageSpinner />;
    }

    return (
        <>
            <FormProvider {...formMethods}>
                <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                    <div className="print:visible print:absolute print:top-10 print:left-10 print:transform print:scale-140">
                        <DetailsHeader />
                        <section className="flex flex-row">
                            <AddressSection isEditing={isEditing} />
                        </section>
                        <OrderedProducts isEditing={isEditing} />
                    </div>
                </form>
            </FormProvider>
        </>
    );
});
