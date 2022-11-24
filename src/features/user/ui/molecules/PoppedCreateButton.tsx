import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { Role } from "../../../types";
import { userStore } from "../../store/UserStore";

export const PoppedCreateButton: FC = observer(() => {
    const { t } = useTranslation();
    const { setRole } = useContext(userStore);
    const [isOpened, setOpened] = useState(false);
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const history = useHistory();
    const onOutside = () => {
        setOpened(false);
    };

    const handleClick = () => {
        setOpened(prev => !prev);
    };

    const onCreate = useCallback(
        (role: Role) => {
            setRole(role);
            history.push(`/user/create`);
        },
        [history, setRole]
    );

    const popperItems = useMemo(
        () => [
            {
                label: t("admin.plural_0"),
                action: () => onCreate("admin")
            },
            {
                label: t("moderator.plural_0"),
                action: () => onCreate("moderator")
            },
            {
                label: t("manufacturer.plural_0"),
                action: () => onCreate("manufacturer")
            },
            {
                label: t("expert.plural_0"),
                action: () => onCreate("expert")
            },
            {
                label: t("retailer.plural_0"),
                action: () => onCreate("retailer")
            }
        ],
        [onCreate, t]
    );

    return (
        <div ref={setReference}>
            <Button
                text={t("create")}
                onClick={handleClick}
                isActive={isOpened}
            />

            {referenceElement && isOpened && (
                <ActionPopper
                    referenceElement={referenceElement}
                    onOutside={onOutside}
                    items={popperItems}
                />
            )}
        </div>
    );
});
