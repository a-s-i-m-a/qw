import { FC, useCallback, useState } from "react";
import cn from "classnames";

import { cropImage } from "../../../features/utils/cropImage";
import { Link } from "react-router-dom";

interface AvatarProps {
    size?: "xs" | "sm" | "lg";
    Placeholder: React.ElementType;
    isCircle?: boolean;
    photoUrl?: string;
    crop?: string;
    alt: string | undefined;
    to?: string;
    objectFit?: "contain" | "cover";
}

export const Avatar: FC<AvatarProps> = ({
    photoUrl,
    Placeholder,
    size = "sm",
    crop,
    alt,
    to,
    objectFit = "contain",
    isCircle = true
}) => {
    const [error, setError] = useState(false);

    const classes = cn("relative inline-flex flex-shrink-0 ", {
        "w-8 h-8": size === "xs",
        "w-10 h-10": size === "sm",
        "w-144p h-144p": size === "lg"
    });
    const imgClasses = cn(
        "w-full h-full",
        {
            "object-contain": objectFit === "contain",
            "object-cover": objectFit === "cover"
        },
        isCircle ? "rounded-full" : "rounded-20p"
    );

    const containerClasses = cn(
        "bg-gray-bg overflow-hidden w-full h-full",
        isCircle ? "rounded-full" : "rounded-20p"
    );

    const placeholderClasses = cn(
        "w-full h-full border-gray-light border-2",
        isCircle ? "rounded-full" : "rounded-20p"
    );

    const onLoad = () => {
        setError(false)
    }

    const onError = () => {
        setError(true)
    }

    const Content = useCallback(
        () =>
            photoUrl && !error ? (
                <div className={containerClasses}>
                    <img
                        className={imgClasses}
                        src={
                            crop && photoUrl
                                ? cropImage(
                                      photoUrl,
                                      Number(crop.split("x")[0]),
                                      Number(crop.split("x")[1])
                                  )
                                : photoUrl
                        }
                        alt={alt}
                        onError={onError}
                        onLoad={onLoad}
                    />
                </div>
            ) : (
                <Placeholder className={placeholderClasses} />
            ),
        [
            photoUrl, 
            error, 
            containerClasses, 
            imgClasses, 
            crop, 
            alt, 
            Placeholder, 
            placeholderClasses
        ]
    );

    if (!to) {
        return (
            <div className={classes}>
                <Content />
            </div>
        );
    }

    return (
        <Link to={to}>
            <span className={classes}>
                <Content />
            </span>
        </Link>
    );
};
