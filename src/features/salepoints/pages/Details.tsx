import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { ROUTE_LINK_SALEPOINTS } from "../routes";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { MainSection } from "../ui/organisms/MainSection";
import { Map } from "../ui/organisms/Map";
import { salepointsSchema } from "../../utils/schemas/SalepointsSchema";
import { salepointsStore } from "../store/SalepointsStore";
import { authStore } from "../../auth/store/AuthStore";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";

export const Details = observer(() => {
    const { id } = useParams<Record<"id", string>>();
    const { t } = useTranslation();
    const history = useHistory();
    const isCreating = useRouteMatch(`/salepoints/create`);
    const { user } = useContext(authStore);
    const {
        setEditing,
        isEditing,
        updateOrCreateSalepoint,
        getSalepoint,
        salepoint,
        coordinates,
        clear
    } = useContext(salepointsStore);
    const coord = salepoint?.location.coordinates.length
        ? {
              lat: salepoint?.location.coordinates[0],
              lng: salepoint?.location.coordinates[1]
          }
        : undefined;
    const formMethods = useForm({
        mode: "onSubmit",
        resolver: joiResolver(salepointsSchema(t))
    });
    const { handleSubmit, reset, formState } = formMethods;
    const { dirtyFields } = formState;

    useEffect(() => {
        if (isCreating) {
            setEditing(true);
        }
    }, [isCreating, setEditing]);

    useEffect(() => {
        !isCreating && getSalepoint(id);
    }, [isCreating, getSalepoint, id]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        if (salepoint) {
            reset(salepoint);
        }
    }, [reset, salepoint]);

    const onSubmit = async (values: any) => {
        try {
            const formData = getDirtyFields(values, dirtyFields);

            formData.location.coordinates = coordinates;
            const updatedSalepoint = await updateOrCreateSalepoint({
                ...formData,
                retailerId: user?.retailer?._id
            });

            if (isCreating) {
                history.push(
                    `${ROUTE_LINK_SALEPOINTS}/${updatedSalepoint._id}`
                );
                throwSuccessToast(
                    t("salepoints.salepointCreated"),
                    t("salepoints.salepointCreatedDescr")
                );
            } else {
                throwSuccessToast(
                    t("salepoints.salepointSaved"),
                    t("changesSavedSuccessfully")
                );
            }
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        } finally {
            setEditing(false);
        }
    };

    if (!salepoint && !isCreating) {
        return <PageSpinner />;
    }
    return (
        <>
            <FormProvider {...formMethods}>
                <form
                    className="w-full h-full  flex flex-col px-50p"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <DetailsHeader isCreating={!!isCreating} />
                    <section className="w-full">
                        <MainSection isEditing={isEditing} />
                    </section>
                    <section className="w-full flex-1">
                        <Map defaultCenter={coord} value={coord} />
                    </section>
                </form>
            </FormProvider>
        </>
    );
});
