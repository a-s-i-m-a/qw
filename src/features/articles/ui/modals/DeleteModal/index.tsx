import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { PromosAPI } from "../../../../utils/api/requests/promos-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface ArticleDeleteModalProps {
    id: string;
}

export const ARTICLE_DELETE_MODAL = "ARTICLE_DELETE_MODAL";

export const ArticleDeleteModal: FC<ArticleDeleteModalProps> = observer(
    ({ id }) => {
        const {
            register,
            activeModalId,
            closeModal,
            modalData,
            modalCallback
        } = useModal<{
            id: string;
        }>();

        const { t } = useTranslation();
        useEffect(() => {
            register({
                id
            });
        }, [id, register]);

        const { mutate, isLoading } = useMutation({
            fetchFn: PromosAPI.removeArticle,
            onSuccess: () => {
                throwSuccessToast(t("articles.articleHasDeleted"));

                const cb = modalCallback[ARTICLE_DELETE_MODAL];
                cb && cb(true);
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });

        const onDelete = () => {
            if (modalData?.id) {
                mutate({ id: modalData.id });
            }

            closeModal();
        };

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t(`articles.sureToDeleteArticle`)}
                </h4>
                <span className="text-14 leading-5 mb-16 px-6">
                    {t(`articles.sureToDeleteArticleDescription`)}
                </span>

                <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                    <Button
                        onClick={closeModal}
                        isDisabled={isLoading}
                        text={t("cancel_2")}
                    />

                    <Button
                        text={t("articles.yesDeleteArticle")}
                        type="tertiary"
                        className="ml-4"
                        onClick={onDelete}
                    />
                </div>
            </section>
        );
    }
);
