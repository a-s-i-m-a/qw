import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { promotionStore } from "../../../promotion/store/PromotionStore";
import { Product } from "../../../types";
import { CatalogueAPI } from "../../../utils/api/requests/catalogue-requests";
import { catalogueStore } from "../../store/CatalogueStore";
import { DELETE_PRODUCT_MODAL } from "../modals/DeleteModal";
import { DELETE_PRODUCT_PROMOTION_MODAL } from "../modals/DeletePromotion";
import { QR_GENERATION_MODAL } from "../modals/QRGenerationModal";
import { QR_REQUEST_MODAL } from "../modals/QRRequestModal";
import { REMOVE_FROM_SALE_MODAL } from "../modals/RemoveFromSaleModal";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { setForceProduct } = useContext(promotionStore);
    const { user } = useContext(authStore);

    const { setModalCallback, openModal } = useContext(modalPageStore);
    const {
        deleteProduct,
        product,
        setProductEditing,
        setProduct
    } = useContext(catalogueStore);
    const history = useHistory();
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const onOutside = () => {
        setOpened(false);
    };

    const [isOpened, setOpened] = useState(false);

    const handleClick = () => {
        setOpened(true);
    };

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(
            DELETE_PRODUCT_MODAL,
            (isSuccess: boolean, data: Product) => {
                isSuccess && setProduct(data);
            }
        );
        deleteProduct(product!._id);
    }, [deleteProduct, product, setModalCallback, setProduct]);

    const onGenerate = useCallback(() => {
        setOpened(false);
        openModal(QR_GENERATION_MODAL, { item: product});
    }, [openModal, product]);

    const onRemoveFromSale = useCallback(() => {
        setOpened(false);
        setModalCallback(
            REMOVE_FROM_SALE_MODAL,
            (isSuccess: boolean, data: Product) => {
                isSuccess && setProduct(data);
            }
        );
        openModal(REMOVE_FROM_SALE_MODAL, {
            item: product
        });
    }, [openModal, product, setModalCallback, setProduct]);

    const onEdit = useCallback(() => {
        setOpened(false);
        setProductEditing(true);
    }, [setProductEditing]);
    const onRestore = useCallback(async () => {
        try {
            const data = await CatalogueAPI.restoreProduct({
                id: product!._id,
                role: user?.role === "manufacturer" ? "manufacturer" : "admin"
            });
            setProduct(data);
            throwSuccessToast(
                t("wineHasRestored"),
                t("wineTransferedTonotOnTheShowCase")
            );
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    }, [product, setProduct, t, user?.role]);
    const requestPromotion = useCallback(() => {
        setForceProduct(product!);
        history.push("/promotion/create");
    }, [history, product, setForceProduct]);
    const removeFromPromotion = useCallback(() => {
        setOpened(false);
        setModalCallback(
            DELETE_PRODUCT_PROMOTION_MODAL,
            (isSuccess: boolean, data: Product) => {
                isSuccess && setProduct(data);
            }
        );
        openModal(DELETE_PRODUCT_PROMOTION_MODAL, {
            item: product
        });
    }, [openModal, product, setModalCallback, setProduct]);

    const onQrRequest = useCallback(() => {
        setOpened(false);
        openModal(QR_REQUEST_MODAL, {item: product});
    }, [openModal, product])

    const popperItems = useMemo(
        () => [
            {
                label: t("restore"),
                action: onRestore,
                visible: product?.isDeleted
            },
            {
                label: t("generateQrCodes"),
                action: onGenerate,
                visible: !product?.isDeleted && user?.role !== "manufacturer"
            },
            {
                label: t("requestQrCodes"),
                action: onQrRequest,
                visible: !product?.isDeleted && user?.role === "manufacturer"
            },
            {
                label: t("requestPromotion"),
                action: requestPromotion,
                visible: !product?.isDeleted && user?.role === "manufacturer"
            },
            {
                label: t("removeFromPromotion"),
                action: removeFromPromotion,
                visible:
                    !product?.isDeleted &&
                    user?.role === "manufacturer" &&
                    product?.isPromoted
            },
            {
                label: t("edit"),
                action: onEdit,
                visible: !product?.isDeleted
            },

            {
                label: t("removeFromSale"),
                action: onRemoveFromSale,
                visible: !product?.isDeleted &&
                product?.isAvailableForSale &&
                ((user?.role === "manufacturer" && !product?.isSoldByQvino) ||
                    (user?.role !== "manufacturer"))
            },
            {
                label: t("delete"),
                action: onDelete,
                visible: !product?.isDeleted &&
                ((user?.role === "manufacturer" && !product?.isSoldByQvino) ||
                    (user?.role !== "manufacturer"))
            }
        ],
        [
            t, 
            onRestore, 
            product?.isDeleted, 
            product?.isPromoted, 
            product?.isAvailableForSale, 
            product?.isSoldByQvino, 
            onGenerate, 
            user?.role, 
            onQrRequest, 
            requestPromotion, 
            removeFromPromotion, 
            onEdit, 
            onRemoveFromSale, 
            onDelete
        ]
    );

    return (
        <div ref={setReference}>
            <Button onClick={handleClick} type={"icon"} htmlType="button">
                <BtnIcon />
            </Button>
            {referenceElement && isOpened && (
                <ActionPopper
                    referenceElement={referenceElement}
                    onOutside={onOutside}
                    items={popperItems.filter(item => item.visible)}
                />
            )}
        </div>
    );
});
