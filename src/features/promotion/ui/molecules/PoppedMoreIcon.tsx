import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import { articlesStore } from "../../../articles/store/ArticlesStore";
import { useModal } from "../../../modalpage/hooks";
import { reviewStore } from "../../../reviews/store/ReviewStore";
import { videoStore } from "../../../videos/store/VideoStore";

interface PoppedMoreIconProps {
    id: string;
    url: "video" | "reviews" | "promotion" | "article";
    modal: string;
}

const labels: Record<
    PoppedMoreIconProps["url"],
    "video.delete" | "review.delete" | "application.delete" | "articles.delete"
> = {
    video: "video.delete",
    reviews: "review.delete",
    promotion: "application.delete",
    article: "articles.delete",
};

export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ id, url, modal }) => {
        const { t } = useTranslation();
        const [isOpened, setOpened] = useState(false);
        const { openModal, setModalCallback } = useModal();
        const { scrollRef, refetch } = useContext(TableContext);
        const { setEditing: setReviewEditing } = useContext(reviewStore);
        const { setEditing: setVideoEditing } = useContext(videoStore);
        const { setEditing: setArticleEditing } = useContext(articlesStore);
        
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();
        const onOutside = () => {
            setOpened(false);
        };
        useEffect(() => {
            const table = scrollRef?.current;
            table?.addEventListener("scroll", onOutside);
            return () => {
                table?.removeEventListener("scroll", onOutside);
            };
        }, [scrollRef]);

        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setOpened(prev => !prev);
        };

        const handleDeleteClick = useCallback(() => {
            setModalCallback(modal, () => {
                refetch();
            });
            openModal(modal, { id });
        }, [id, modal, openModal, refetch, setModalCallback]);
        const history = useHistory();
        const handleEdit = useCallback(() => {
            history.push(`${url}/${id}`);
            if (url === "reviews") {
                setReviewEditing(true);
            }
            if (url === "video") {
                setVideoEditing(true);
            }
            if (url === "article") {
                setArticleEditing(true);
            }
        }, [history, id, setReviewEditing, setVideoEditing, setArticleEditing, url]);
        const popperItems = useMemo(
            () => [
                {
                    label: t(labels[url]) as string,
                    action: handleDeleteClick,
                    visible: true
                },
                {
                    label: t("edit"),
                    action: handleEdit,
                    visible: url !== "promotion"
                }
            ],
            [handleDeleteClick, t, handleEdit, url]
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
