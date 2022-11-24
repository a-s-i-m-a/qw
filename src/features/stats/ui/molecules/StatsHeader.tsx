import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../ui/atoms/Button";
import { CurrencyChanger } from "../../../../ui/organisms/CurrencyChanger";
import { TabList } from "../../../../ui/organisms/TabList";
import { Currency } from "../../../types";
import { statsStore } from "../../store/StatsStore";

interface StatsHeaderProps {
    currency: string;
    setCurrency: (value: Currency) => void;
}

export const StatsHeader: FC<StatsHeaderProps> = observer(
    ({ currency, setCurrency }) => {
        const { t } = useTranslation();
        const { activeTab, setTab } = useContext(statsStore);
        const onPrint = () => {
            window.print();
        };
        return (
            <section className="flex items-center mb-46p flex-shrink-0">
                <TabList
                    activeIndex={activeTab}
                    onChange={setTab}
                    options={[t("scannings"), t("stats.sales")]}
                />
                <section className="grid grid-flow-col gap-30p ml-5 absolute right-50p top-50p">
                    <Button
                        htmlType="button"
                        type="primary"
                        text={t("print")}
                        onClick={onPrint}
                    />
                    <CurrencyChanger
                        className="self-center"
                        selected={currency}
                        select={setCurrency}
                    />
                </section>
            </section>
        );
    }
);
