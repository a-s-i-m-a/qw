import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useController } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { TabOptions, TernaryTabList } from "../TernaryTabList";

interface LanguageChangerProps {
    name: string;
}

export const langTabs: TabOptions[] = [
    {
        label: "English",
        Icon: "🇬🇧",
        value: "en"
    },
    {
        label: "Russian",
        Icon: "🇷🇺",
        value: "ru"
    },
    {
        label: "Italian",
        Icon: "🇮🇹",
        value: "it"
    }
];
export const LanguageTabChanger: FC<LanguageChangerProps> = observer(
    ({ name }) => {
        const { control } = useFormContext();
        const {
            field: { value, onChange }
        } = useController({ name, control });

        return (
            <TernaryTabList
                value={value}
                onChange={onChange}
                options={langTabs}
            />
        );
    }
);
