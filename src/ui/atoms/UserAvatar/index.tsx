import { FC, useCallback, useState } from "react";
import cn from "classnames";

import { Link } from "react-router-dom";
import { cropImage } from "../../../features/utils/cropImage";
import { ProfilePlaceholder } from "../illustration";

interface AvatarProps {
    to?: string;
    photoUrl?: string;
    alt: string;
    size?: "sm";
    crop?: string;
}

export const UserAvatar: FC<AvatarProps> = ({
    to,
    photoUrl,
    alt,
    size = "sm",
    crop
}) => {
    const classes = cn("relative inline-flex flex-shrink-0 ", {
        "w-8 h-8": size === "sm"
    });

    const [error, setError] = useState(false);

    const onLoad = () => {
        setError(false)
    }

    const onError = () => {
        setError(true)
    }

    const Content = useCallback(
        () =>
            photoUrl && !error ? (
                <div
                    className={`bg-gray-bg rounded-full overflow-hidden w-full h-full`}
                >
                    <img
                        className="w-full h-full object-cover rounded-full"
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
                        onLoad={onLoad}
                        onError={onError}
                    />
                </div>
            ) : (
                <ProfilePlaceholder className="w-full h-full rounded-20p border-gray-light border-2" />
            ),
        [alt, crop, error, photoUrl]
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
