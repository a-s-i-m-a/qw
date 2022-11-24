import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GrapeSort, Region, VineStyle } from "../../../types";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { catalogueStore } from "../../store/CatalogueStore";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FetchSelect } from "../molecules/FetchSelect";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { REGION_EDIT_MODAL } from "../../../directory/ui/modals/RegionModal";
import { WINESTYLE_EDIT_MODAL } from "../../../directory/ui/modals/WineStyleModal";
import { GRAPESORT_EDIT_MODAL } from "../../../directory/ui/modals/GrapeSortModal";
import { isAllowedToCreate } from "../../utils/isAllowedToCreate";
import { authStore } from "../../../auth/store/AuthStore";
import { FormInput } from "../../../../ui/atoms/FormInput";

export const OriginSection = observer(() => {
    const { setValue, getValues, watch } = useFormContext();
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const { openModal, setModalCallback } = useContext(modalPageStore);

    const addRegion = (value: string) => {
        const country = getValues("country");

        setModalCallback(
            REGION_EDIT_MODAL,
            (isSuccess: boolean, item: Region<false>) => {
                if (isSuccess) {
                    setValue(
                        "region",
                        {
                            label: item.name,
                            value: item._id
                        },
                        {
                            shouldDirty: true,
                            shouldValidate: true
                        }
                    );
                }
            }
        );

        openModal(REGION_EDIT_MODAL, {
            item: {
                name: value,
                country: {
                    _id: country.value,
                    name: country.label
                }
            }
        });
    };
    const addWineStyle = (value: string) => {
        setModalCallback(
            WINESTYLE_EDIT_MODAL,
            (isSuccess: boolean, item: VineStyle<false>) => {
                if (isSuccess) {
                    setValue(
                        "wineStyle",
                        {
                            label: item.name,
                            value: item._id
                        },
                        {
                            shouldDirty: true,
                            shouldValidate: true
                        }
                    );
                }
            }
        );

        openModal(WINESTYLE_EDIT_MODAL, {
            item: {
                name: value
            }
        });
    };
    const addGrapeSort = (value: string) => {
        const prevValues = getValues("grapeSorts") || [];
        setModalCallback(
            GRAPESORT_EDIT_MODAL,
            (isSuccess: boolean, item: GrapeSort<false>) => {
                if (isSuccess) {
                    setValue(
                        "grapeSorts",
                        [
                            ...prevValues,
                            {
                                label: item.name,
                                value: item._id
                            }
                        ],
                        {
                            shouldDirty: true,
                            shouldValidate: true
                        }
                    );
                }
            }
        );

        openModal(GRAPESORT_EDIT_MODAL, {
            item: {
                name: value
            }
        });
    };
    return (
        <>
            <SectionHeader title={t("origins")} />

            <section className="grid grid-cols-2 gap-10 mt-20p mb-60p">
                <FetchSelect
                    fetchFn={DirectoryAPI.getCountries}
                    placeholder={t("chooseCountry")}
                    name="country"
                    label={t("country")}
                    isSearchable={true}
                    isEditing={isProductEditing}
                />
                <FetchSelect
                    fetchFn={DirectoryAPI.getRegions}
                    placeholder={t("chooseRegion")}
                    label={t("region.plural_0")}
                    name="region"
                    isEditing={isProductEditing}
                    allowCreating={isAllowedToCreate(user?.role)}
                    isDisabled={!watch("country")}
                    isSearchable={true}
                    onCreateOption={addRegion}
                    extraArgs={{
                        countryId: watch("country")?.value
                    }}
                    key={watch("country")?.value}
                />
                <FetchSelect
                    fetchFn={DirectoryAPI.getGrapeSorts}
                    placeholder={t("chooseGrapeSort")}
                    label={t("grapeSort.plural_0")}
                    name="grapeSorts"
                    isSearchable={true}
                    isMulti={true}
                    isEditing={isProductEditing}
                    className="col-span-2"
                    allowCreating={isAllowedToCreate(user?.role)}
                    onCreateOption={addGrapeSort}
                />
                <FetchSelect
                    fetchFn={DirectoryAPI.getVineStyles}
                    placeholder={t("chooseWineStyle")}
                    label={t("wineStyle.plural_0")}
                    isSearchable={true}
                    name="wineStyle"
                    isEditing={isProductEditing}
                    className="col-span-2"
                    allowCreating={isAllowedToCreate(user?.role)}
                    onCreateOption={addWineStyle}
                />
                <FormInput
                    name="altitude"
                    label={t("altitude")}
                    isEditing={isProductEditing}
                />
                <FormInput
                    name="recommendedYear"
                    label={t("recommendedYear")}
                    isEditing={isProductEditing}
                    placeholder={"YYYY"}
                />
                <FormInput
                    name="agingPotential"
                    label={t("agingPotential")}
                    isEditing={isProductEditing}
                    description={t("typeValueRange", {
                        min: 1,
                        max: 60
                    })}
                />
            </section>
        </>
    );
});
