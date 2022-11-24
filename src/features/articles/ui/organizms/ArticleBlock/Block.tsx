import { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Languages } from "../../../../types";
import { FormTextarea } from "../../../../../ui/atoms/FormTextarea";
import { TrashIcon } from "../../../../../ui/atoms/Icon";
import { AddBlockBtns } from "../../molecules/AddBlockBtns";
import { ImageUpload } from "../../molecules/ImageUpload";
import { useWatch } from "react-hook-form";

interface BlockProps {
    index: number;
    name: string;
    remove: (index: number) => void;
    isEditing?: boolean;
    lang: Languages;
    alt?: string;
    onTextClick: (index: number) => void;
    onImageClick: (index: number) => void;
}

export const Block: FC<BlockProps> = ({
    index,
    name,
    remove: removeBlock,
    isEditing,
    lang,
    onTextClick,
    onImageClick
}) => {
    const { t } = useTranslation();
    const block = useWatch({ name: "blocks" });

    const blockClasses = cn(
        "flex flex-row items-center justify-between w-full",
        {
            "my-40p": isEditing,
            "mt-0": !isEditing && index === 0,
            "mt-40p": !isEditing && index !== 0
        }
    );
    return (
        <li>
            <section className="flex flex-col items-center">
                <div className={blockClasses}>
                    {(block[lang][index]?.type === "text" ||
                        block[lang][index]?.body) && (
                        <FormTextarea
                            hideLabel={true}
                            name={`${name}.${lang}.${index}.body`}
                            label={
                                isEditing ? t("articles.textBlock") : undefined
                            }
                            textareaClasses="resize-none min-h-170p"
                            isEditing={isEditing}
                            maxLength={600}
                        />
                    )}

                    {(block[lang][index]?.type === "image" ||
                        block[lang][index]?.imageId) && (
                        <ImageUpload
                            name={`${name}.${lang}.${index}.imageId`}
                            isDisabled={!isEditing}
                        />
                    )}
                    {isEditing && (
                        <TrashIcon
                            className="cursor-pointer mx-3"
                            onClick={() => removeBlock(index)}
                        />
                    )}
                </div>
                <div className="w-full">
                    {isEditing && (
                        <AddBlockBtns
                            onImageBlockClick={() => onImageClick(index + 1)}
                            onTextBlockClick={() => onTextClick(index + 1)}
                        />
                    )}
                </div>
            </section>
        </li>
    );
};
