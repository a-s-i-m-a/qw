import React from "react";
import { useTranslation } from "react-i18next";
import { FC } from "react-router/node_modules/@types/react";
import { ImageIcon, TextIcon } from "../../../../ui/atoms/Icon";
import { IconButton } from "../atoms/IconButton";

interface AddBlockBtnsProps {
    onImageBlockClick: () => void;
    onTextBlockClick: () => void;
}

export const AddBlockBtns: FC<AddBlockBtnsProps> = ({
    onImageBlockClick,
    onTextBlockClick
}) => {
    const { t } = useTranslation();

    return (
        <section className="relative justify-center items-center">
            <p className="absolute top-1/2 bg-dashed-line w-full h-1p z-0"></p>
            <section className="relative flex items-center w-290p h-80p bg-gray-bg py-12p m-auto px-30p z-10 rounded-20p">
                <p className="z-10 text-base text-dark-main font-semibold">
                    {t("add")}
                </p>
                <IconButton
                    className="z-10 w-14 h-14 ml-20p"
                    htmlType="button"
                    onClick={onTextBlockClick}
                >
                    <TextIcon className="m-auto" />
                </IconButton>
                <IconButton
                    className="z-10 w-14 h-14 ml-20p"
                    htmlType="button"
                    onClick={onImageBlockClick}
                >
                    <ImageIcon className="m-auto" />
                </IconButton>
            </section>
        </section>
    );
};
