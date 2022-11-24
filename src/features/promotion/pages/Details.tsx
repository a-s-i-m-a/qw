import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { FeaturesSection } from "../ui/organisms/FeaturesSection";
import { useEffect, useContext } from "react";
import { promotionStore } from "../store/PromotionStore";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { WineSelectingSection } from "../ui/organisms/WineSelectingSection";
import { ProductSection } from "../ui/organisms/ProductSection";
import { PromoPayload } from "../types";
import { transformPromo } from "../utils/transformPromo";
import { joiResolver } from "@hookform/resolvers/joi";
import { getPromoSchema } from "../../utils/schemas/PromoSchema";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { authStore } from "../../auth/store/AuthStore";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { FailedResponse, Video } from "../../types";

export const Details = observer(() => {
    const {
        loadPromo,
        isEditing,
        clear,
        promo,
        setEditing,
        forceProduct,
        acceptPromo,
        createPromo
    } = useContext(promotionStore);
    const { t } = useTranslation();
    const isCreating = useRouteMatch("/promotion/create");
    const { id } = useParams<Record<"id", string>>();
    const { user } = useContext(authStore);
    const history = useHistory();

    const formMethods = useForm<PromoPayload>({
        mode: "onChange",
        resolver: joiResolver(getPromoSchema(t, user?.role)),
        defaultValues: {
            bonusInstrument: {
                type: "bonusPoints",
                isEnabled: false
            },
            discountInstrument: {
                type: "discount",
                isEnabled: false
            },
            reviewInstrument: {
                type: "expertReview",
                isEnabled: false
            },
            videoInstrument: {
                type: "expertVideo",
                isEnabled: false
            },
            productId: forceProduct
                ? {
                      value: forceProduct?._id,
                      label: forceProduct?.name
                  }
                : undefined
        }
    });
    const { reset } = formMethods;

    useEffect(() => {
        if (
            isCreating ||
            (promo &&
                user?.role !== "manufacturer" &&
                promo?.status !== "finished")
        ) {
            setEditing(true);
        }
    }, [isCreating, promo, promo?.status, setEditing, user?.role]);

    useEffect(() => {
        !isCreating && loadPromo(id);
    }, [id, isCreating, loadPromo]);
    useEffect(() => {
        promo && reset(transformPromo(promo));
    }, [reset, promo]);

    useEffect(() => {
        return () => {
            clear();
        };
    }, [clear]);

    const onSubmit = async (values: PromoPayload) => {
        try {
            if (user?.role === "manufacturer") {
                const newPromo = await createPromo(values);
                throwSuccessToast(t("promoRequested"), t("pleaseWaitForAdmin"));
                isCreating && history.replace(`/promotion/${newPromo._id}`);
            } else {
                await acceptPromo(values);
                throwSuccessToast(
                    t("wineWasPromoted"),
                    t("wineMovedToPromoted")
                );
                history.push(`/promotion`);
            }
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

    if (!promo && !isCreating) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <form
                onSubmit={formMethods.handleSubmit(onSubmit)}
                className="px-50p"
            >
                <DetailsHeader />
                <section className="w-720p grid gap-y-50p">
                    <ProductSection />
                    {!promo?._id && (
                        <WineSelectingSection isEditing={isEditing} />
                    )}
                    <FeaturesSection />
                </section>
            </form>
        </FormProvider>
    );
});
