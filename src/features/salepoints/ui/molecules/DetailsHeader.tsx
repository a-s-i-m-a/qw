import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { ROUTE_LINK_SALEPOINTS } from "../../routes";
import { salepointsStore } from "../../store/SalepointsStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { PoppedEditButton } from "./PoppedEditButton";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { t } = useTranslation();
        const { salepoint, isEditing, setEditing } = useContext(
            salepointsStore
        );
        const history = useHistory();
        const { reset, formState } = useFormContext();
        const { isDirty } = formState;
        const onBack = () => {
            history.push(ROUTE_LINK_SALEPOINTS);
        };

        const onCancel = () => {
            if (salepoint) {
                reset(salepoint);
            } else {
                onBack();
            }
            setEditing(false);
        };

        return (
            <PageHeader
                onBack={!isEditing && !isCreating ? onBack : undefined}
                title={getDetailsTitle(salepoint, isEditing, !!isCreating, t)}
            >
                {(isEditing || !salepoint) && (
                    <>
                        <Button
                            htmlType="button"
                            type="secondary"
                            text={t("cancel_1")}
                            onClick={onCancel}
                        />
                        <Button
                            htmlType="submit"
                            text={salepoint ? t("save") : t("create")}
                            isDisabled={!isDirty}
                        />
                    </>
                )}
                {!isEditing && salepoint && <PoppedEditButton />}
            </PageHeader>
        );
    }
);
