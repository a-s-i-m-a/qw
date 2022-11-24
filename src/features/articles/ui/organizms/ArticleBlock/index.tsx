import { FC } from "react";
import cn from "classnames";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Languages } from "../../../../../features/types";
import { useCallback } from "react";
import { AddBlockBtns } from "../../molecules/AddBlockBtns";
import { Block } from "./Block";

export interface ArticleBlockProps {
    className?: string;
    name: string;
    isEditing?: boolean;
    lang: Languages;
    alt?: string;
}

export const ArticleBlock: FC<ArticleBlockProps> = ({
    className = "",
    name,
    isEditing = true,
    lang,
    alt
}) => {
    const context = useFormContext();
    if (!context) {
        throw new Error("Provide FormContext before Blocks");
    }

    const { control } = context;
    const { fields, remove, insert } = useFieldArray({
        control,
        name: `${name}.${lang}`
    });

    const addNewTextBlock = useCallback(
        index => {
            insert(index, {
                type: "text",
                body: ""
            });
        },
        [insert]
    );

    const addNewImageBlock = useCallback(
        index => {
            insert(index, {
                type: "image",
                imageId: ""
            });
        },
        [insert]
    );

    const BlockWithLang = useCallback(
        () => (
            <ul>
                {fields?.map((field, index) => (
                    <Block
                        key={field.id}
                        remove={remove}
                        index={index}
                        name={name}
                        isEditing={isEditing}
                        lang={lang}
                        onImageClick={addNewImageBlock}
                        onTextClick={addNewTextBlock}
                    />
                ))}
            </ul>
        ),
        [
            fields,
            isEditing,
            lang,
            name,
            remove,
            addNewImageBlock,
            addNewTextBlock
        ]
    );

    const wrapperClasses = cn("flex flex-col", className);
    return (
        <section className={wrapperClasses}>
            {isEditing && (
                <AddBlockBtns
                    onImageBlockClick={() => addNewImageBlock(0)}
                    onTextBlockClick={() => addNewTextBlock(0)}
                />
            )}
            {fields.length > 0 && <BlockWithLang />}
        </section>
    );
};
