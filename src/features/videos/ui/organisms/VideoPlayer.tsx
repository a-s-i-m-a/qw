import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { videoStore } from "../../store/VideoStore";

export const VideoPlayer: FC = observer(() => {
    const { t } = useTranslation();
    const { video } = useContext(videoStore);
    const language = useWatch({ name: "currentLang" });

    const Player = useCallback(
        () => (
            <Controller
                name={`youtubeVideoId.${language.value}`}
                render={({ field: { value } }) =>
                    value ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${value}`}
                            frameBorder="0"
                            allowFullScreen
                            width={720}
                            height={405}
                            title={`${video?.product.name} on ${language.value} language`}
                        />
                    ) : (
                        <section className="w-720 h-405p text-18 text-gray-text font-semibold flex items-center justify-center">
                            {t("videoNotUploadedYet")}
                        </section>
                    )
                }
            />
        ),
        [language.value, t, video?.product.name]
    );

    return <Player />;
});
