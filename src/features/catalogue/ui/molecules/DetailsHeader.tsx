import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Product } from "../../../types";
import { ROUTE_LINK_CATALOGUE } from "../../routes";
import { catalogueStore } from "../../store/CatalogueStore";
import { getStatus } from "../../utils/getStatus";
import { getStatusText } from "../../utils/getStatusText";
import { transformProduct } from "../../utils/transformProduct";
import { Status } from "../atoms/Status";
import { ADD_TO_SALE_MODAL } from "../modals/AddToSaleModal";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = observer(() => {
    const { t } = useTranslation();
    const {
        product,
        isProductEditing,
        setProductEditing,
        setProduct
    } = useContext(catalogueStore);
    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { user } = useContext(authStore);
    const history = useHistory();
    const { reset, formState } = useFormContext();
    const { isDirty } = formState;
    const onBack = () => {
        history.push(ROUTE_LINK_CATALOGUE);
    };

    const onCancel = () => {
        if (product) {
            reset(transformProduct(product));
        } else {
            onBack();
        }
        setProductEditing(false);
    };

    const onAddtoSale = () => {
        setModalCallback(
            ADD_TO_SALE_MODAL,
            (isSuccess: boolean, data: Product) => {
                isSuccess && setProduct(data);
            }
        );
        openModal(ADD_TO_SALE_MODAL, { item: product });
    };

    return (
        <PageHeader
            onBack={!isProductEditing ? onBack : undefined}
            title={
                product
                    ? isProductEditing
                        ? t("positionEditing")
                        : product.name
                    : t("newPosition")
            }
            afterTitle={
                product && (
                    <Status
                        className="ml-5"
                        text={getStatusText(product, t)}
                        status={getStatus(product)}
                    />
                )
            }
        >
            {!isProductEditing &&
                !product?.isAvailableForSale &&
                !product?.isDeleted &&
                ((user?.role === "manufacturer" && !product?.isSoldByQvino) ||
                    (user?.role !== "manufacturer")) && (
                    <Button
                        type="primary"
                        htmlType="button"
                        text={t("addToSale")}
                        onClick={onAddtoSale}
                    />
                )}
            {(isProductEditing || !product) && (
                <>
                    <Button
                        htmlType="button"
                        type="secondary"
                        text={t("cancel_1")}
                        onClick={onCancel}
                    />
                    <Button
                        htmlType="submit"
                        text={product ? t("save") : t("create")}
                        isDisabled={!isDirty}
                    />
                </>
            )}

            {!isProductEditing && product && <PoppedEditButton />}
        </PageHeader>
    );
});
