import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { ROUTE_LINK_GIFTS } from "../../routes";
import { giftsStore } from "../../store/GiftsStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = observer(() => {
    const { t } = useTranslation();
    const { gift, isEditing, setGiftEditing } = useContext(giftsStore);
    const history = useHistory();
    const { reset, formState } = useFormContext();
    const { isDirty } = formState;
    const onBack = () => {
        history.push(ROUTE_LINK_GIFTS);
    };

    const onCancel = () => {
        if (gift) {
            reset(gift);
        } else {
            onBack();
        }
        setGiftEditing(false);
    };

    return (
        <PageHeader
            onBack={!isEditing ? onBack : undefined}
            title={getDetailsTitle(gift, isEditing, t)}
        >
            {(isEditing || !gift) && (
                <>
                    <Button
                        htmlType="button"
                        type="secondary"
                        text={t("cancel_1")}
                        onClick={onCancel}
                    />
                    <Button
                        htmlType="submit"
                        text={gift ? t("save") : t("create")}
                        isDisabled={!isDirty}
                    />
                </>
            )}
            {!isEditing && gift && <PoppedEditButton />}
        </PageHeader>
    );
});