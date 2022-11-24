import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { getGiftSchema } from "../../utils/schemas/GiftSchema";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { ImageUpload } from "../../../ui/atoms/ImageUpload";
import { useTranslation } from "react-i18next";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { giftsStore } from "../store/GiftsStore";
import { useContext, useEffect } from "react";
import { PriceSection } from "../ui/organisms/PriceSection";
import { MainSection } from "../ui/organisms/MainSection";
import { ToggleAvailability } from "../ui/organisms/ToggleAvailability";
import { uploadFile } from "../../utils/api/requests/file-requests";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { ROUTE_LINK_GIFTS } from "../routes";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Gift, Languages } from "../../types";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { transformData } from '../utils/transformGift'

export const Details = observer(() => {
    const { t, i18n } = useTranslation();
    const currentLang: Languages = i18n.language as Languages;
    const isCreating = useRouteMatch("/gift/create");
    const { 
        gift, 
        isEditing, 
        setGiftEditing, 
        updateOrCreateGift,
        selectedLang,
        setSelectedLang 
    } = useContext(giftsStore);
    const history = useHistory();
    const formMethods = useForm<Gift>({
        mode: "onChange",
        defaultValues: {
            saleStatus: gift?.saleStatus,
            lang: langTabs.find(lang => lang.value === "en")
        },
        resolver: joiResolver(getGiftSchema(t))
    });
    const {
        handleSubmit,
        reset,
        formState,
        setValue,
        clearErrors
    } = formMethods;
    const { errors, isValid, dirtyFields, isSubmitting } = formState;
    const values = formMethods.watch(["name", "description", "lang"]);

    const onSubmit = async (values: Gift) => {
        let photoId = values.photoId || null;
        try {
            if (values?.photo instanceof File) {
                const { _id } = await uploadFile(values?.photo);
                photoId = _id;
            }
            const formData = getDirtyFields(
                {
                    ...values
                },
                dirtyFields
            );
            await updateOrCreateGift({
                ...formData,
                lang: values?.lang,
                saleStatus: values?.saleStatus,
                photoId: photoId
            });
            if (gift) {
                throwSuccessToast(
                    t("changesSaved"),
                    t("changesSavedSuccessfully")
                );
            } else {
                throwSuccessToast(t("gift.giftCreated"));
            }
            setGiftEditing(false);
            if (!gift) {
                history.push(ROUTE_LINK_GIFTS);
            }
            isCreating ? setSelectedLang(null) : setSelectedLang(values?.lang?.value);
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    useEffect(() => {
        if (gift) {
            if (selectedLang) {
                reset(transformData(gift, selectedLang));
            } else {
                reset(transformData(gift));
            }
        }
    }, [gift, reset, selectedLang]);

    useEffect(() => {
        if (!gift) {
            setGiftEditing(true);
        }
        return () => {
            setGiftEditing(false);
        };
    }, [gift, setGiftEditing]);

    useEffect(() => {
        if (isSubmitting && !isValid) {
            const currentLang = values[2]?.value;
            const nameError = errors?.["name"] ?? {};
            const descriptionError = errors?.["description"] ?? {};
            const descrErrorLangs = Object.keys(
                descriptionError
            ) as Languages[];
            const nameErrorLangs = Object.keys(nameError) as Languages[];
            let switchLang = currentLang as Languages;
                
            if (!nameErrorLangs.includes(currentLang)) {
                if (nameErrorLangs.length) {
                    switchLang = nameErrorLangs[0]
                }
            }
            if (!descrErrorLangs.includes(currentLang)) {
                if (descrErrorLangs.length) {
                    switchLang = descrErrorLangs[0]
                }
            }
            
            if (
                switchLang !== currentLang 
                && values[0][currentLang as Languages] !== "" 
                && values[1][currentLang as Languages] !== ""
            ) {
                setValue(
                    "lang",
                    langTabs.find(lang => lang.value === switchLang)!
                );
            }
        }
    }, [clearErrors, errors, isSubmitting, isValid, setValue, values]);

    return (
        <FormProvider {...formMethods}>
            <form
                className="px-50p flex-1 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <DetailsHeader />
                <ImageUpload
                    name="photo"
                    isDisabled={!isEditing}
                    EmptyState={WinePlaceholder}
                    alt={gift?.name[currentLang]}
                />
                <section className="w-720p flex flex-col">
                    <PriceSection />
                    <ToggleAvailability />
                    <MainSection />
                </section>
            </form>
        </FormProvider>
    );
});
