import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext, useEffect } from "react";
import { FailedResponse, Video } from "../../types";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { videoStore } from "../store/VideoStore";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { transformVideo } from "../utils/transformVideo";
import { VideoPayload } from "../types";
import { getVideoSchema } from "../../utils/schemas/VideoSchema";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { AdminForm } from "../ui/organisms/AdminForm";
import { authStore } from "../../auth/store/AuthStore";
import { ManufacturerForm } from "../ui/organisms/ManufacturerForm";

export const Details = observer(() => {
    const { videoId } = useParams<Record<"videoId", string>>();
    const { t } = useTranslation();
    const history = useHistory();
    const isCreating = useRouteMatch(["/video/create"]);
    const { user } = useContext(authStore);
    const {
        loadVideo,
        setEditing,
        video,
        clear,
        updateOrCreateVideo,
        selectedLang,
        setSelectedLang
    } = useContext(videoStore);

    const formMethods = useForm<VideoPayload>({
        mode: "onChange",
        defaultValues: {
            currentLang: langTabs.find(lang => lang.value === "en")
        },
        resolver: joiResolver(getVideoSchema(t))
    });

    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        if (isCreating) {
            setEditing(true);
        }
    }, [history, isCreating, setEditing]);

    useEffect(() => {
        !isCreating && loadVideo(videoId);
    }, [isCreating, loadVideo, videoId]);
    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        if (video) {
            if (selectedLang) {
                reset(transformVideo(video, selectedLang))
            } else {
                reset(transformVideo(video))
            }
        }
    }, [reset, video, selectedLang]);

    const onSubmit = async (values: VideoPayload) => {
        try {
            const updatedVideo = await updateOrCreateVideo(values);

            throwSuccessToast(t("videoWasSaved"));
            isCreating && history.push(`/video/${updatedVideo._id}`);
            isCreating ? setSelectedLang(null) : setSelectedLang(values?.currentLang?.value)
            setEditing(false);
        } catch (e) {
            const event = (e as unknown) as FailedResponse<Video>;

            if (event?.response?.data?.error?.id === 400.139) {
                throwErrorToast(t("error"), t("invalidVideoLink"));
                return;
            }
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    if (!video && !isCreating) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <DetailsHeader isCreating={!!isCreating} />
                {user?.role === "manufacturer" ? (
                    <ManufacturerForm />
                ) : (
                    <AdminForm />
                )}
            </form>
        </FormProvider>
    );
});
