import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Currency } from "../../types";
import { statsStore } from "../store/StatsStore";
import { TabOptions } from "../ui/molecules/SelectPeriodTabs/TabList";
import { StatsHeader } from "../ui/molecules/StatsHeader";
import { ChartSection } from "../ui/organisms/ChartSection";
import { OptionSection } from "../ui/organisms/OptionSection";
import { StatsSection } from "../ui/organisms/StatsSection";
import { getPeriodTabs, startOfToday } from "../utils/getOptions";

interface Form {
    period: TabOptions<false> | undefined;
    manufacturer: TabOptions<true> | undefined;
    country: TabOptions<true> | undefined;
}

export const Main = observer(() => {
    const { t } = useTranslation();
    const {
        activeTab,
        sellsPieData,
        commissionPieData,
        cancelledPieData,
        completedPieData,
        graphData,
        loadGraphData,
        clear,
        loadPieData
    } = useContext(statsStore);
    const formMethods = useForm<Form>({
        mode: "onChange",
        defaultValues: {
            period: getPeriodTabs(t).find(tab => tab.value[0] === startOfToday),
            manufacturer: undefined,
            country: undefined
        }
    });
    const { handleSubmit, watch, setValue } = formMethods;
    const [currency, setCurrency] = useState<Currency>("rub");
    const [sellsTab, setSellsTab] = useState(0);
    const [sellsChartType, setSellsChartType] = useState(0);
    const [orderTab, setOrderTab] = useState(0);
    const [orderChartType, setOrderChartType] = useState(0);
    const chosenPeriod = watch("period");
    const manufacturer = watch("manufacturer");
    const country = watch("country");
    const args = useMemo(
        () => ({
            from: chosenPeriod?.value[0],
            to: chosenPeriod?.value[1],
            manufacturerId: manufacturer?.value,
            countryId: country?.value,
            currency: currency
        }),
        [chosenPeriod?.value, country?.value, currency, manufacturer?.value]
    );

    useEffect(() => {
        if (activeTab === 1) {
            loadGraphData({ ...args });
        }
    }, [activeTab, args, loadGraphData]);

    useEffect(() => {
        loadPieData(sellsTab, sellsChartType, orderTab, orderChartType, args);
    }, [orderTab, sellsChartType, sellsTab, orderChartType, loadPieData, args]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    const onChangeSelect = () => {
        setValue("manufacturer", undefined);
    };

    return (
        <>
            <FormProvider {...formMethods}>
                <form className="px-50p" onSubmit={handleSubmit(() => {})}>
                    <StatsHeader
                        currency={currency}
                        setCurrency={setCurrency}
                    />
                    {activeTab === 1 && (
                        <section className="w-720p print:visible print:absolute print:top-10 print:left-10 print:transform print:scale-140">
                            <OptionSection onChangeSelect={onChangeSelect} />
                            <StatsSection currency={currency} />
                            <ChartSection
                                tabs={[t("stats.sales"), t("stats.commission")]}
                                period={chosenPeriod}
                                currency={currency}
                                tab={sellsTab}
                                chartType={sellsChartType}
                                setTab={setSellsTab}
                                setChartType={setSellsChartType}
                                accessor={
                                    sellsTab === 0
                                        ? "sellsTotal"
                                        : "commissionTotal"
                                }
                                pieData={
                                    sellsTab === 0
                                        ? sellsPieData?.items
                                        : commissionPieData?.items
                                }
                            />
                            <ChartSection
                                tabs={[
                                    t("stats.complitedOrders"),
                                    t("orders.tabsCanceled")
                                ]}
                                period={chosenPeriod}
                                currency={currency}
                                tab={orderTab}
                                chartType={orderChartType}
                                setTab={setOrderTab}
                                setChartType={setOrderChartType}
                                accessor={
                                    orderTab === 0
                                        ? "completedOrderCount"
                                        : "cancelledOrderCount"
                                }
                                pieData={
                                    orderTab === 0
                                        ? completedPieData?.items
                                        : cancelledPieData?.items
                                }
                            />
                            <ChartSection
                                isMultiple={false}
                                tabs={[t("stats.salesGeography")]}
                                currency={currency}
                                pieData={graphData?.sellsByCountry}
                            />
                        </section>
                    )}
                </form>
            </FormProvider>
        </>
    );
});
