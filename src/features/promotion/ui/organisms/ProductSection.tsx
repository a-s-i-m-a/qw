import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useCallback } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { throwErrorToast } from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { productFields } from "../../../fields/product";
import { CatalogueAPI } from "../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../utils/hooks/useMutation";
import { promotionStore } from "../../store/PromotionStore";
import { InfoSection } from "./InfoSection";

export const ProductSection = observer(() => {
    const { promo, setForceProduct } = useContext(promotionStore);
    const { user } = useContext(authStore);

    const { setValue } = useFormContext();
    const productOption = useWatch({ name: "productId" });
    const { t } = useTranslation();

    const { mutate, isLoading, data, isError } = useMutation({
        fetchFn: CatalogueAPI.getProduct,
        onError: () => throwErrorToast(t("error"), t("unknownError")),
        onSuccess: product => setForceProduct(product)
    });

    const fetch = useCallback(
        (id: string) => {
            mutate({
                id,
                role: user?.role === "manufacturer" ? "manufacturer" : "admin",
                _fields: productFields
            });
        },
        [mutate, user?.role]
    );
    useEffect(() => {
        if (data) {
            setValue("product", data);
        }
    }, [data, setValue]);
    useEffect(() => {
        if (
            productOption &&
            !isLoading &&
            !isError &&
            productOption?.value !== data?._id &&
            promo?.product._id !== productOption?.value
        ) {
            fetch(productOption.value);
        }
    }, [
        data?._id,
        fetch,
        isError,
        isLoading,
        productOption,
        promo?.product?._id
    ]);

    return (
        <InfoSection product={data ?? promo?.product} isLoading={isLoading} />
    );
});
