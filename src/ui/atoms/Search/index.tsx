import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ResetIcon, SearchIcon } from "../Icon";
import cn from "classnames";

interface SearchProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    value: string;
}
export const Search: FC<SearchProps> = ({
    onChange,
    className = "",
    value
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const inputCn = cn(
        "w-full bg-gray-bg rounded-20p font-normal text-14 leading-5 text-dark-main placeholder-gray-text",
        "py-10p pl-10 pr-3"
    );
    const onReset = () => {
        if (ref.current) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype!,
                "value"
            )!.set;
            nativeInputValueSetter!.call(ref.current, "");

            const event = new Event("change", {
                bubbles: true
            });
            ref.current.dispatchEvent(event);
        }
    };
    return (
        <section className={`relative ${className}`}>
            <SearchIcon className="absolute left-10p top-10p" />
            <input
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={t("search")}
                className={inputCn}
            />
            {value && (
                <ResetIcon
                    onClick={onReset}
                    className="absolute right-4 top-10p cursor-pointer opacity-80 hover:opacity-100"
                />
            )}
        </section>
    );
};
