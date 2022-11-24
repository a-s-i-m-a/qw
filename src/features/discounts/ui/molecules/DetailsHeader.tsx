import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { Status } from "../../../catalogue/ui/atoms/Status";
import { DiscountsAPI } from "../../../utils/api/requests/discounts-requests";
import { ROUTE_LINK_DISCOUNTS } from "../../routes";
import { discountsStore } from "../../store/DiscountsStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { getStatus, getStatusText } from "../../utils/getStatus";
import { transformDiscount } from "../../utils/transform";
import { PoppedEditButton } from "./PoppedEditButton";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { t } = useTranslation();
        const { discount, isEditing, setEditing } = useContext(discountsStore);
        const { id } = useParams<Record<"id", string>>();
        const { user } = useContext(authStore);
        const history = useHistory();
        const { reset, formState } = useFormContext();
        const { isDirty } = formState;
        const onBack = () => {
            history.push(ROUTE_LINK_DISCOUNTS);
        };

        const onCancel = () => {
            if (discount) {
                reset({
                    ...transformDiscount(discount),
                });
            } else {
                onBack();
            }
            setEditing(false);
        };
        const onAccept = async (id: string) => {
            try {
                await DiscountsAPI.changeStatus({ id });
                history.push(ROUTE_LINK_DISCOUNTS);
                throwSuccessToast(
                    t("discounts.acceptDiscount"),
                    t("discounts.acceptDiscountDescr")
                );
            } catch {
                throwErrorToast(t("error"), t("unknownError"));
            }
        };

        return (
            <PageHeader
                onBack={!isEditing ? onBack : undefined}
                title={getDetailsTitle(discount, isEditing, isCreating, t)}
                afterTitle={
                    discount?.status && (
                        <Status
                            status={getStatus(discount.status)}
                            className="ml-5"
                            text={getStatusText(discount.status, t)}
                        />
                    )
                }
            >
                {(isEditing || !discount) && (
                    <>
                        <Button
                            htmlType="button"
                            type="secondary"
                            text={t("cancel_1")}
                            onClick={onCancel}
                        />
                        <Button
                            htmlType="submit"
                            text={discount ? t("save") : t("create")}
                            isDisabled={!isDirty}
                        />
                    </>
                )}
                {!isEditing && discount && (
                    <>
                        {user?.role !== "retailer" && discount.status === "pending" && (
                            <Button
                                htmlType="button"
                                type="primary"
                                text={t("accept")}
                                onClick={() => onAccept(id)}
                            />
                        )}
                        <PoppedEditButton />
                    </>
                )}
            </PageHeader>
        );
    }
);
