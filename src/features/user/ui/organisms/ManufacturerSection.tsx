import { FC, useContext } from "react";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { useTranslation } from "react-i18next";
import { userStore } from "../../store/UserStore";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { authStore } from "../../../auth/store/AuthStore";
import { UserSectionProps } from "../../types";
import { isAllowedToCreate } from "../../../catalogue/utils/isAllowedToCreate";
import { MANUFACTURER_EDIT_MODAL } from "../../../directory/ui/modals/ManufacturerModal";
import { Manufacturer } from "../../../types";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { useFormContext } from "react-hook-form";

export const ManufacturerSection: FC<UserSectionProps> = ({ isMe }) => {
    const { setValue } = useFormContext();
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    const { isUserEditing } = useContext(userStore);
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
        <section className="w-720p grid grid-cols-2 gap-30p mb-12">
            <FetchSelect
                fetchFn={DirectoryAPI.getManufacturers}
                placeholder={t("notChosen")}
                label={t("manufacturer.plural_0")}
                name="manufacturer"
                isEditing={isUserEditing}
                isSearchable={true}
                onCreateOption={addManufacturer}
                allowCreating={isAllowedToCreate(user?.role)}
                isDisabled={user?.role === "manufacturer"}
            />
            <FormInput
                name={"name"}
                isEditing={isUserEditing}
                label={t("firstAndLastName")}
                autoFocus={true}
            />

            <FormInput
                name={"login"}
                label={"Email"}
                isEditing={isUserEditing}
                isDisabled={isMe}
            />
            <FormInput
                name={"phone"}
                isEditing={isUserEditing}
                label={t("phone")}
                isMaskedNumber={true}
                decimalScale={0}
                allowNegative={false}
                isNumericString={false}
            />
        </section>
    );
};

