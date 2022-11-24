import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '../../../../ui/atoms/FormInput';
import { FetchSelect } from '../../../catalogue/ui/molecules/FetchSelect';
import { DirectoryAPI } from '../../../utils/api/requests/directory-requests';
import { userStore } from '../../store/UserStore';

export const UserDetails = () => {
    const { t } = useTranslation();
    const {
        isUserEditing,
    } = useContext(userStore);

    return (
        <>
            <section className="grid grid-cols-4 gap-x-40p mt-20p mb-40p">
                <FetchSelect
                    fetchFn={DirectoryAPI.getCountries}
                    placeholder={t("chooseCountry")}
                    name="country"
                    label={t("country")}
                    isSearchable={true}
                    isEditing={isUserEditing}
                    className="w-220p"
                />
                <FormInput
                    name={"login"}
                    isEditing={isUserEditing}
                    label={t("phone")}
                    isMaskedNumber={true}
                    decimalScale={0}
                    allowNegative={false}
                    isNumericString={false}
                />
                <FormInput
                    name={"email"}
                    label={"Email"}
                    isEditing={isUserEditing}
                    autoFocus={true}
                />
                <FormInput
                    name={"balances.points"}
                    isEditing={isUserEditing}
                    label={t("scores")}
                    autoFocus={true}
                />
            </section>
        </>
    );
};
