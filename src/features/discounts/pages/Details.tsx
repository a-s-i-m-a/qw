import { useTranslation } from "react-i18next";
import { useForm, FormProvider, SubmitErrorHandler } from "react-hook-form";
import { useEffect, useContext } from "react";
import { uploadFile } from "../../utils/api/requests/file-requests";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { ImageUpload } from "../../../ui/atoms/ImageUpload";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { joiResolver } from "@hookform/resolvers/joi";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { TabList } from "../../../ui/organisms/TabList";
import { useState } from "react";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { discountsStore } from "../store/DiscountsStore";
import { MainSection } from "../ui/organisms/MainSection";
import { SalepointsList } from "../ui/organisms/SalepointsList";
import { Discounts } from "../../types";
import { ROUTE_LINK_DISCOUNTS } from "../routes";
import { getDiscountSchema } from "../../utils/schemas/DiscountsSchema";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { EDIT_DISCOUNT_MODAL } from "../ui/modals/EditDiscount";
import { authStore } from "../../auth/store/AuthStore";
import { getSalepointsArray } from "../utils/getSalepointsArray";
import { transformDiscount, transformPayload } from "../utils/transform";

export const Details = observer(() => {
    const { t } = useTranslation();
    const { id } = useParams<Record<"id", string>>();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState(0);
    const { user } = useContext(authStore);
    const isCreating = useRouteMatch("/discounts/create");
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const {
        discount,
        isEditing,
        setTab,
        setDiscount,
        updateOrCreateDiscount,
        setEditing,
        loadDiscount,
        clear
    } = useContext(discountsStore);
    const formMethods = useForm({
        mode: "onChange",
        resolver: joiResolver(getDiscountSchema(t))
    });
    const { handleSubmit, reset, formState, watch } = formMethods;
    const { dirtyFields } = formState;
    const retailerStoresObj = watch("retailerStoreIds");

    useEffect(() => {
        !isCreating && loadDiscount(id);
    }, [isCreating, loadDiscount, id]);

    useEffect(() => {
        if (discount) {
            reset({
                ...transformDiscount(discount)
            });
        }
    }, [discount, reset]);

    useEffect(() => {
        if (isCreating) {
            setEditing(true);
        }
    }, [isCreating, setEditing]);

    useEffect(() => {
        return () => {
            clear();
        };
    }, [clear]);

    const onSubmit = async (values: Discounts<false>) => {
        try {
            let imageId = values?.image?._id || null;
            if (values?.image instanceof File) {
                const { _id } = await uploadFile(values.image);
                imageId = _id;
            }
            const formData = transformPayload({
                ...getDirtyFields(values, dirtyFields),
                imageId
            });
            let updatedDiscount: Partial<Discounts> = {};
            if (
                user?.role === "retailer" &&
                !isCreating &&
                discount?.status === "accepted" &&
                !(
                    Object.keys(dirtyFields).length >= 1 &&
                    dirtyFields.hasOwnProperty("retailerStoreIds")
                )
            ) {
                setModalCallback(
                    EDIT_DISCOUNT_MODAL,
                    (isSuccess: boolean, data: Discounts) => {
                        isSuccess && setDiscount(data);
                    }
                );
                openModal(EDIT_DISCOUNT_MODAL, {
                    item: {
                        ...formData,
                        _id: values._id,
                        imageId,
                        retailerStoreIds: getSalepointsArray(retailerStoresObj)
                    }
                });
            } else {
                const data = await updateOrCreateDiscount({
                    ...formData,
                    retailerStoreIds: getSalepointsArray(retailerStoresObj)
                });
                throwSuccessToast(
                    t("changesSaved"),
                    t("changesSavedSuccessfully")
                );
                setEditing(false);
                if (isCreating) {
                    history.push(ROUTE_LINK_DISCOUNTS);
                    setTab(1);
                } else {
                    history.replace(`${ROUTE_LINK_DISCOUNTS}/${data._id}`);
                }
                return (updatedDiscount = data);
            }
            if (!discount) {
                history.replace(
                    `${ROUTE_LINK_DISCOUNTS}/${updatedDiscount._id}`
                );
            }
        } catch (e) {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };
    const onTabChange = (index: number) => {
        setActiveTab(index);
    };

    if (!discount && !isCreating) {
        return <PageSpinner />;
    }

    const onError: SubmitErrorHandler<Discounts> = errors => {
        const nameError = errors?.["name"];
        const descriptionError = errors?.["description"];
        const countryError = errors?.["country"];
        const priceError = errors?.["price"];

        if (nameError || descriptionError || countryError || priceError) {
            setActiveTab(0);
        }
    };
    return (
        <FormProvider {...formMethods}>
            <form
                className="px-50p flex-1 flex flex-col"
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <DetailsHeader isCreating={!!isCreating} />
                <TabList
                    className="mb-30p"
                    activeIndex={activeTab}
                    onChange={onTabChange}
                    options={[
                        t("discounts.general"),
                        t("discounts.selepointsCount", {
                            count:
                                getSalepointsArray(retailerStoresObj).length ??
                                0
                        })
                    ]}
                />
                {activeTab === 0 ? (
                    <>
                        <ImageUpload
                            EmptyState={WinePlaceholder}
                            name="image"
                            isDisabled={!isEditing}
                            objectFit="cover"
                            alt={discount?.name}
                            minImgDimension={140}
                        />
                        <section className="w-720p flex flex-col flex-shrink-0">
                            <MainSection />
                        </section>
                    </>
                ) : (
                    <>
                        <SalepointsList />
                    </>
                )}
            </form>
        </FormProvider>
    );
});
