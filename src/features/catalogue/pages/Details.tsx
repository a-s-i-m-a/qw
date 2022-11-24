import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useContext } from "react";
import { catalogueStore } from "../store/CatalogueStore";
import { ProductPayload } from "../types";
import { uploadFile } from "../../utils/api/requests/file-requests";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { RatingsSection } from "../ui/organisms/RatingsSection";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { MainSection } from "../ui/organisms/MainSection";
import { OriginSection } from "../ui/organisms/OriginSection";
import { transformPayload, transformProduct } from "../utils/transformProduct";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { ImageUpload } from "../../../ui/atoms/ImageUpload";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { CombinationsSection } from "../ui/organisms/CombinationsSection";
import { AgencyRatingSection } from "../ui/organisms/AgencyRatingSection";
import { getProductSchema } from "../../utils/schemas/ProductSchema";
import { joiResolver } from "@hookform/resolvers/joi";
import { PriceSection } from "../ui/organisms/PriceSection";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { TabList } from "../../../ui/organisms/TabList";
import { useState } from "react";
import { PromoTab } from "../ui/organisms/PromoTab";
import { ROUTE_LINK_PRODUCT } from "../routes";
import { authStore } from "../../auth/store/AuthStore";
import { CharacteristicSection } from "../ui/organisms/CharacteristicSection";
import { QvinoCheckbox } from "../ui/molecules/QvinoCheckbox";

export const Details = observer(() => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const {
        product,
        isProductEditing,
        updateOrCreateProduct,
        setProductEditing
    } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const formMethods = useForm<ProductPayload>({
        mode: "onChange",
        defaultValues: {
            manufacturer:
                user?.role === "manufacturer"
                    ? {
                          value: user.manufacturer?._id,
                          label: user.manufacturer?.name
                      }
                    : undefined
        },
        resolver: joiResolver(getProductSchema(t, user!.role, !!product))
    });
    const { handleSubmit, reset, formState, clearErrors } = formMethods;
    const { dirtyFields, isSubmitted, isValid, errors } = formState;

    useEffect(() => {
        if (product) {
            reset(transformProduct(product));
        }
    }, [product, reset]);

    useEffect(() => {
        if (!product) {
            setProductEditing(true);
        }
        return () => {
            setProductEditing(false);
        };
    }, [product, setProductEditing]);

    const history = useHistory();

    //@ts-ignore infinity dep
    const values = formMethods.watch([
        "discountInstrument",
        "bonusInstrument",
        "reviewInstrument",
        "videoInstrument"
    ]);

    useEffect(() => {
        //tab switcher
        if (isSubmitted && !isValid) {
            const discountError = errors?.["discountInstrument"];
            const bonusError = errors?.["bonusInstrument"];
            const reviewError = errors?.["reviewInstrument"];
            const videoError = errors?.["videoInstrument"];

            if (discountError || bonusError || reviewError || videoError) {
                setActiveTab(1);
                clearErrors();
            }
        }
    }, [errors, isSubmitted, isValid, values, clearErrors]);
    const onSubmit = async (values: ProductPayload) => {
        let photoId = values.photoId || null;

        if (values?.photo instanceof File) {
            const { _id } = await uploadFile(values?.photo);
            photoId = _id;
        }

        try {
            const formData = transformPayload({
                ...getDirtyFields<ProductPayload>(values, dirtyFields),
                ...(!values._id && user?.role === "manufacturer"
                    ? { manufacturer: values.manufacturer }
                    : {}),
                photoId: dirtyFields.photo ? photoId : undefined,
                isSoldByQvino: values?.isSoldByQvino 
            });

            const updatedProduct = await updateOrCreateProduct(formData);
            throwSuccessToast(t("changesSaved"), t("changesSavedSuccessfully"));
            setProductEditing(false);
            if (!product) {
                history.push(`${ROUTE_LINK_PRODUCT}/${updatedProduct._id}`);
            }
        } catch (e) {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };
    const onTabChange = (index: number) => {
        setActiveTab(index);
    };
    return (
        <FormProvider {...formMethods}>
            <form
                className="px-50p flex-1 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <DetailsHeader />
                {product && (
                    <TabList
                        className="mb-50p"
                        activeIndex={activeTab}
                        onChange={onTabChange}
                        options={[t("wineInfo"), t("promotion")]}
                    />
                )}
                {activeTab === 0 || !product ? (
                    <>
                        <ImageUpload
                            EmptyState={WinePlaceholder}
                            name="photo"
                            isDisabled={!isProductEditing}
                            objectFit="cover"
                            alt={product?.name}
                            minImgDimension={280}
                        />
                        <section className="w-720p flex flex-col flex-shrink-0">
                            <MainSection />
                            <OriginSection />
                            <CharacteristicSection />
                            <CombinationsSection />
                            <PriceSection />
                            <QvinoCheckbox />
                            {user?.role === "manufacturer" &&
                            isProductEditing ? null : (
                                <>
                                    <RatingsSection />
                                    <AgencyRatingSection />
                                </>
                            )}
                        </section>
                    </>
                ) : (
                    <PromoTab />
                )}
            </form>
        </FormProvider>
    );
});
