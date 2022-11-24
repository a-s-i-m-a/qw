import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Languages } from "../../../types";
import { articlesStore } from "../../store/ArticlesStore";
import { ArticleBlock, ArticleBlockProps } from "./ArticleBlock";

interface BlockSectionProps {
    isEditing?: boolean;
}
export const BlockSection: FC<BlockSectionProps> = observer(
    ({ isEditing = false }) => {
        const { article } = useContext(articlesStore);
        const language = useWatch({ name: "currentLang" });
        const block = useWatch({ name: "blocks" });
        const { unregister } = useFormContext();

        const BlockWithLang = useCallback(
            ({ isEditing }: Partial<ArticleBlockProps>) => (
                <ArticleBlock
                    name="blocks"
                    isEditing={isEditing}
                    lang={language.value}
                />
            ),
            [language]
        );

        useEffect(() => {
            // for correct validation we should unregister empty fields
            block &&
                Object.entries(block).forEach(BlockWithLang => {
                    const [lang, blocks] = BlockWithLang;
                    if (lang === language.value) {
                        return;
                    }
                    Array.isArray(blocks) &&
                        blocks.length === 0 &&
                        unregister(`blocks.${lang as Languages}`, {
                            keepError: true
                        });
                });
        }, [unregister, block, language?.value]);

        return (
            <section>
                <BlockWithLang
                    isEditing={isEditing}
                    alt={article?.manufacturer?.name}
                />
            </section>
        );
    }
);
