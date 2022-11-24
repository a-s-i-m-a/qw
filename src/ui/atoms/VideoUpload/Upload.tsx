import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { CloseSmIcon, PlayIcon } from '../Icon';
import cn from "classnames";

interface UploadProps {
    value: any;
    isEditing: boolean;
    className?: string;
    name: string;
    error?: FieldError;
    onRemove: () => void;
}

export const Upload: FC<UploadProps> = ({
    value, 
    isEditing, 
    className,
    name,
    error,
    onRemove
}) => {
    const { t } = useTranslation();
    const uploadCn = cn("justify-items-center mt-20p", "", className);
    return (
        <>
            {value ? (
                <span className="flex flex-row items-center mt-20p h-40p">
                    {value instanceof File ? (
                        <span>{value?.name}</span>
                    ) : (
                        <span className="flex flex-row items-center">
                            <a
                                className="mr-14p focus:outline-none"
                                href={`${value?.url}?sid=${localStorage["sessionId"]}`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <PlayIcon />
                            </a>
                            {value?.name}
                        </span>
                    )}
                    {isEditing && 
                    <button
                        className="w-22p h-22p rounded-full bg-purple-main flex items-center justify-center ml-18p focus:outline-none"
                        type="button"
                        onClick={onRemove}
                    >
                        <CloseSmIcon />
                    </button>
                    }
                </span>
            ) : (
                <div className={uploadCn}>
                    <label className={`mt-auto cursor-pointer`} htmlFor={name}>
                        <Button
                            htmlType="button"
                            className="pointer-events-none"
                            text={t("certificate.attachVideo")}
                        />
                    </label>
                    <AnimatePresence>
                        {error && (
                            <motion.span
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -5, opacity: 0 }}
                                transition={{
                                    duration: 0.2
                                }}
                                className="inline-block text-12 font-normal text-danger mt-3"
                            >
                                {error.message}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
};
