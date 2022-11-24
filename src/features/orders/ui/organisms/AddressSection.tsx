import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Select } from "../../../../ui/atoms/Select";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { ordersStore } from "../../store/OrdersStore";
import { getOptions } from "../../utils/getOptions";
import { getStateLabel } from "../../utils/getState";

export interface ArticleBlockProps {
    isEditing?: boolean;
}

export const AddressSection: FC<ArticleBlockProps> = observer(({ isEditing }) => {
    const { t } = useTranslation();
    const { order } = useContext(ordersStore);
    const countryIso = useWatch({
        name: "deliveryAddress.country.iso"
    });
    const options = getOptions(countryIso ?? order?.deliveryAddress?.country?.iso);
    const isStateVisible = !!options;
    return (
        <section>
            <section className="mb-50p">
                <FormInput
                    name="createDate"
                    label={t("createDate")}
                    className="w-220p mr-40p"
                    isEditing={false}
                />
                <FormInput
                    name="deliveryAddress.phone"
                    label={t("orders.contactPhone")}
                    className="w-220p"
                    isEditing={isEditing}
                />
            </section>
            <SectionHeader title={t("orders.address")} />
            <section className="grid grid-cols-3 gap-x-30p mt-20p">
                <FetchSelect
                    fetchFn={DirectoryAPI.getCountries}
                    placeholder={t("chooseCountry")}
                    name="deliveryAddress.country"
                    label={t("orders.deliveryCountry")}
                    isSearchable={true}
                    isEditing={isEditing}
                    className="w-220p"
                />
                <Select
                    name="deliveryAddress.state"
                    defaultOptions={options}
                    placeholder={t("notChosen")}
                    label={getStateLabel(t, countryIso ?? order?.deliveryAddress?.country?.iso)}
                    isEditing={isEditing}
                    className={`w-220p ${!isStateVisible && "hidden"}`}
                    needTranslation={true}
                />
                <FormInput
                    name="deliveryAddress.city"
                    label={t("orders.city")}
                    className="w-220p"
                    isEditing={isEditing}
                />
            </section>
            <section className="grid grid-cols-3 gap-x-30p mt-35p">    
                <FormInput
                    name="deliveryAddress.address"
                    label={t("orders.firstLine")}
                    className="w-220p"
                    isEditing={isEditing}
                />
                <FormInput
                    name="deliveryAddress.apartment"
                    label={t("orders.secondLine")}
                    className="w-220p"
                    isEditing={isEditing}
                />
                <FormInput
                    name="deliveryAddress.zip"
                    label={t("orders.zip")}
                    className="w-220p"
                    isEditing={isEditing}
                />
            </section>
        </section>
    );
});
