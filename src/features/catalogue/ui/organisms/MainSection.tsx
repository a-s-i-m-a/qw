import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumberFormatValues } from "react-number-format";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { FormTextarea } from "../../../../ui/atoms/FormTextarea";
import { Select } from "../../../../ui/atoms/Select";
import { Manufacturer, Wines } from "../../../types";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { catalogueStore } from "../../store/CatalogueStore";
import { transformObjectToOption } from "../../utils/objectUtils";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FetchSelect } from "../molecules/FetchSelect";

import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { MANUFACTURER_EDIT_MODAL } from "../../../directory/ui/modals/ManufacturerModal";
import { authStore } from "../../../auth/store/AuthStore";
import { isAllowedToCreate } from "../../utils/isAllowedToCreate";
import { LanguageTabChanger } from "../../../../ui/organisms/LanguageTabChanger";

const wineOptions = transformObjectToOption(Wines);

export const MainSection = observer(() => {
    const { setValue } = useFormContext();
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const addManufacturer = async (value: string) => {
        setModalCallback(
            MANUFACTURER_EDIT_MODAL,
            (isSuccess: boolean, item: Manufacturer) => {
                if (isSuccess) {
                    setValue(
                        "manufacturer",
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

        openModal(MANUFACTURER_EDIT_MODAL, {
            item: {
                name: value
            }
        });
    };
    return (
        <>
            <SectionHeader title={t("main")} />
            <section className="grid grid-cols-2 gap-10 mt-20p mb-60p">
                <FormInput
                    name="name"
                    label={t("title")}
                    isEditing={isProductEditing}
                    placeholder={t("title")}
                    maxLength={120}
                />
                <FetchSelect
                    fetchFn={DirectoryAPI.getManufacturers}
                    placeholder={t("notChosen")}
                    label={t("manufacturer.plural_0")}
                    name="manufacturer"
                    isEditing={isProductEditing}
                    isSearchable={true}
                    onCreateOption={addManufacturer}
                    allowCreating={isAllowedToCreate(user?.role)}
                    isDisabled={user?.role === "manufacturer"}
                />
                <Select
                    name="wineType"
                    placeholder={t("notChosen")}
                    defaultOptions={wineOptions}
                    label={t("type")}
                    isEditing={isProductEditing}
                    needTranslation={true}
                />
                <FormInput
                    name="vintage"
                    placeholder={"YYYY"}
                    label={t("year")}
                    format="####"
                    isMaskedNumber={true}
                    decimalScale={0}
                    allowNegative={false}
                    isEditing={isProductEditing}
                />
                <FormInput
                    name="alcoholLevel"
                    label={t("degree")}
                    isMaskedNumber={true}
                    decimalScale={2}
                    allowNegative={false}
                    multiplyingKoef={100}
                    isAllowed={({ floatValue }: NumberFormatValues) =>
                        Number(floatValue || 0) < 100
                    }
                    suffix="%"
                    isEditing={isProductEditing}
                    placeholder={t("degree")}
                />
                <FormInput
                    name="volume"
                    label={t("volume")}
                    isMaskedNumber={true}
                    multiplyingKoef={100}
                    decimalScale={2}
                    allowNegative={false}
                    isEditing={isProductEditing}
                    placeholder={t("volume")}
                />
                <div className="grid grid gap-4 grid-cols-1">
                    <SectionHeader title={t("aboutWine")}  />
                    <LanguageTabChanger name="currentLang"  />
                </div>
                <FormTextarea
                    name={"description"}
                    textareaClasses="min-h-170p resize-none"
                    label={t("description")}
                    isEditing={isProductEditing}
                    placeholder={t("description")}
                    className="col-span-2"
                    maxLength={600}
                />
                <FormInput
                    name="videoUrl"
                    label={t("wineVideoURL")}
                    isEditing={isProductEditing}
                    placeholder={t("wineVideoURL")}
                    className="col-span-2"
                />
            </section>
        </>
    );
});
