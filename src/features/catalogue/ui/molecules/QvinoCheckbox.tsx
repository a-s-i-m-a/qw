import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';
import { CheckedIcon } from '../../../../ui/atoms/Icon';
import { catalogueStore } from '../../store/CatalogueStore';
import { Checkbox } from '../atoms/Checkbox';
import cn from "classnames";
import { useTranslation } from 'react-i18next';
import { authStore } from '../../../auth/store/AuthStore';

export const QvinoCheckbox = observer(() => {
    const { t } = useTranslation();
    const value = useWatch({name: "isSoldByQvino"});
    const { isProductEditing } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const wrapperClass = cn(
        "flex flex-row items-center mb-60p w-210p"
    )

    return (
        <section className={wrapperClass}>
            {user?.role === "manufacturer"
            ?
                <>
                    {value 
                        ?
                        <span className="flex flex-row flex-1 items-center bg-gray-bg pl-15p py-11p border-0 rounded-10p">
                            <CheckedIcon />
                            <p className="text-14 text-dark-text ml-4 font-semibold">{t("vineSoldByQvino")}</p>
                        </span>
                        :
                        null 
                    }
                </>
            :
                <>
                    {isProductEditing 
                        ?  
                        <Checkbox 
                            name={'isSoldByQvino'}
                        >
                            <p className="text-14 text-dark-text ml-4">{t("vineSoldByQvino")}</p>
                        </Checkbox>
                        : value && 
                            <span className="flex flex-row flex-1 items-center bg-gray-bg pl-15p py-11p border-0 rounded-10p">
                                <CheckedIcon />
                                <p className="text-14 text-dark-text ml-4 font-semibold">{t("vineSoldByQvino")}</p>
                            </span>
                    }
                </>
            }
        </section>
    );
});