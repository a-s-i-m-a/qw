import { FC, useContext } from "react";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { useTranslation } from "react-i18next";
import { userStore } from "../../store/UserStore";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { authStore } from "../../../auth/store/AuthStore";
import { UserSectionProps } from "../../types";
import { isAllowedToCreate } from "../../../catalogue/utils/isAllowedToCreate";
import { useFormContext } from "react-hook-form";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Retailer } from "../../../types";
import { RETAILER_EDIT_MODAL } from "../../../directory/ui/modals/RetailerModal";

export const RetailerSection: FC<UserSectionProps> = ({ isMe }) => {
    const { setValue } = useFormContext();
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    const { isUserEditing } = useContext(userStore);
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const addRetailer = async (value: string) => {
        setModalCallback(
            RETAILER_EDIT_MODAL,
            (isSuccess: boolean, item: Retailer) => {
                if (isSuccess) {
                    setValue(
                        "retailer",
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

        openModal(RETAILER_EDIT_MODAL, {
            item: {
                name: value
            }
        });
    };

    return (
        <section className="w-720p grid grid-cols-2 gap-30p mb-12">
            <FetchSelect
                fetchFn={DirectoryAPI.getRetailers}
                placeholder={t("typeRetailerTitle")}
                label={t("retailerTitle")}
                name="retailer"
                isEditing={isUserEditing}
                isSearchable={true}
                onCreateOption={addRetailer}
                allowCreating={isAllowedToCreate(user?.role)}
                isDisabled={user?.role === "retailer"}
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
