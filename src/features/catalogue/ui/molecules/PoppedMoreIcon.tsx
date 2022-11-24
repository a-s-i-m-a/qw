import { observer } from "mobx-react-lite";
import React, {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { promotionStore } from "../../../promotion/store/PromotionStore";
import { Product } from "../../../types";
import { CatalogueAPI } from "../../../utils/api/requests/catalogue-requests";
import { ROUTE_LINK_PRODUCT } from "../../routes";
import { catalogueStore } from "../../store/CatalogueStore";
import { DELETE_PRODUCT_MODAL } from "../modals/DeleteModal";
import { DELETE_PRODUCT_PROMOTION_MODAL } from "../modals/DeletePromotion";
import { QR_GENERATION_MODAL } from "../modals/QRGenerationModal";
import { QR_REQUEST_MODAL } from "../modals/QRRequestModal";
import { REMOVE_FROM_SALE_MODAL } from "../modals/RemoveFromSaleModal";

interface PoppedMoreIconProps {
    item: Product;
    restoreMode?: boolean;
    inSale?: boolean;
    onPromotion?: boolean;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ item, restoreMode, inSale, onPromotion }) => {
        const { deleteProduct, setProductEditing } = useContext(catalogueStore);
        const { refetch, scrollRef } = useContext(TableContext);
        const { setModalCallback, openModal } = useContext(modalPageStore);
        const { setForceProduct } = useContext(promotionStore);

        const { user } = useContext(authStore);
        const { t } = useTranslation();
        const history = useHistory();

        const [isOpened, setOpened] = useState(false);
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();

        useEffect(() => {
            const table = scrollRef?.current;
            table?.addEventListener("scroll", onOutside);
            return () => {
                table?.removeEventListener("scroll", onOutside);
            };
        }, [scrollRef]);

        const onOutside = () => {
            setOpened(false);
        };

        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setOpened(prev => !prev);
        };

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_PRODUCT_MODAL, (isSuccess: boolean) => {
                isSuccess && refetch();
            });
            deleteProduct(item._id);
        }, [deleteProduct, item, refetch, setModalCallback]);

        const onEdit = useCallback(() => {
            setOpened(false);
            setProductEditing(true);
            history.push(`${ROUTE_LINK_PRODUCT}/${item._id}`);
        }, [history, item, setProductEditing]);
        const onGenerate = useCallback(() => {
            setOpened(false);

            openModal(QR_GENERATION_MODAL);
        }, [openModal]);
        const onRestore = useCallback(async () => {
            try {
                await CatalogueAPI.restoreProduct({
                    id: item._id,
                    role:
                        user?.role === "manufacturer" ? "manufacturer" : "admin"
                });
                throwSuccessToast(
                    t("wineHasRestored"),
                    t("wineTransferedTonotOnTheShowCase")
                );
                refetch();
            } catch {
                throwErrorToast(t("error"), t("unknownError"));
            }
        }, [item._id, refetch, t, user?.role]);
        const onRemoveFromSale = useCallback(() => {
            setOpened(false);
            setModalCallback(REMOVE_FROM_SALE_MODAL, (isSuccess: boolean) => {
                isSuccess && refetch();
            });
            openModal(REMOVE_FROM_SALE_MODAL, {
                item
            });
        }, [setModalCallback, openModal, item, refetch]);
        const requestPromotion = useCallback(() => {
            setForceProduct(item);
            history.push("/promotion/create");
        }, [history, item, setForceProduct]);

        const removeFromPromotion = useCallback(() => {
            setOpened(false);
            setModalCallback(
                DELETE_PRODUCT_PROMOTION_MODAL,
                (isSuccess: boolean) => {
                    isSuccess && refetch();
                }
            );
            openModal(DELETE_PRODUCT_PROMOTION_MODAL, {
                item
            });
        }, [item, openModal, refetch, setModalCallback]);

        const onQrRequest = useCallback(() => {
            setOpened(false);
            openModal(QR_REQUEST_MODAL, {item});
        }, [item, openModal])
        
        const popperItems = useMemo(
            () => [
                {
                    label: t("restore"),
                    action: onRestore,
                    visible: restoreMode
                },
                {
                    label: t("edit"),
                    action: onEdit,
                    visible: !restoreMode
                },
                {
                    label: t("generateQrCodes"),
                    action: onGenerate,
                    visible: !restoreMode && user?.role !== "manufacturer"
                },
                {
                    label: t("requestQrCodes"),
                    action: onQrRequest,
                    visible: !restoreMode && user?.role === "manufacturer"
                },
                {
                    label: t("requestPromotion"),
                    action: requestPromotion,
                    visible: !restoreMode && user?.role === "manufacturer"
                },
                {
                    label: t("removeFromPromotion"),
                    action: removeFromPromotion,
                    visible: onPromotion && user?.role === "manufacturer"
                },
                {
                    label: t("removeFromSale"),
                    action: onRemoveFromSale,
                    visible: !restoreMode && 
                    (inSale || item.isAvailableForSale) && 
                    ((user?.role === "manufacturer" && !item?.isSoldByQvino) ||
                    (user?.role !== "manufacturer"))
                },
                {
                    label: t("delete"),
                    action: onDelete,
                    visible: !restoreMode && 
                    ((user?.role === "manufacturer" && !item?.isSoldByQvino) ||
                    (user?.role !== "manufacturer"))
                }
            ],
            [
                t, 
                onRestore, 
                restoreMode, 
                onEdit, 
                onGenerate, 
                user?.role, 
                onQrRequest, 
                requestPromotion, 
                removeFromPromotion, 
                onPromotion, 
                onRemoveFromSale, 
                inSale, 
                item.isAvailableForSale, 
                item?.isSoldByQvino, 
                onDelete
            ]
        );

        return (
            <div ref={setReference}>
                <MoreIcon
                    onClick={handleClick}
                    dotsColorClass={
                        isOpened
                            ? "text-white"
                            : "text-dark-main hover:text-white"
                    }
                    circleColorClass={
                        isOpened
                            ? "text-purple-main"
                            : "text-gray-light hover:text-purple-main"
                    }
                />
                {referenceElement && isOpened && (
                    <ActionPopper
                        referenceElement={referenceElement}
                        onOutside={onOutside}
                        items={popperItems.filter(item => item.visible)}
                    />
                )}
            </div>
        );
    }
);
