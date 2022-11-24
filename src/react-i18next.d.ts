import "react-i18next";
import en from "../public/locales/en/translation.json";
import ru from "../public/locales/ru/translation.json";

declare module "react-i18next" {
    interface CustomTypeOptions {
        defaultNS: "en";
        resources: {
            en: typeof en;
            ru: typeof ru;
        };
    }
    type Translation = Normalize<typeof en>;
}
