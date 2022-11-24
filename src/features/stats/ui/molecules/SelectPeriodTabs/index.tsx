import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useController } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { TabOptions, TabList } from "./TabList";

interface LanguageChangerProps {
    name: string;
    options: TabOptions[];
}

export const SelectPeriodTabs: FC<LanguageChangerProps> = observer(
    ({ name, options }) => {
        const { control } = useFormContext();
        const {
            field: { value, onChange }
        } = useController({ name, control });
        return <TabList value={value} onChange={onChange} options={options} />;
    }
);
