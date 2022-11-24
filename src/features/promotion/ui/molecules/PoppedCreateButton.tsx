import { observer } from "mobx-react-lite";
import { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";

export const PoppedCreateButton: FC = observer(() => {
    const { t } = useTranslation();
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
        (type: string) => {
            history.push(`/${type}/create`);
        },
        [history]
    );

    const popperItems = useMemo(
        () => [
            {
                label: t("video.plural_4"),
                action: () => onCreate("video")
            },
            {
                label: t("review.plural_4"),
                action: () => onCreate("reviews")
            },
            {
                label: t("article.plural_4"),
                action: () => onCreate("article")
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
