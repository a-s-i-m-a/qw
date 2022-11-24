import {
    JamesIcon,
    RobertIcon,
    SpectatorIcon,
    GamberoRosso
} from "../../ui/atoms/Icon";
import { OptionType } from "../../ui/atoms/Select";

export const AGENT_RATINGS = [
    {
        code: "rosso",
        max: 100,
        min: 0,
        allowDecimal: true,
        title: "Gambero Rosso",
        Icon: GamberoRosso
    },
    {
        code: "james",
        max: 100,
        min: 0,
        title: "James Suckling",
        Icon: JamesIcon
    },
    {
        code: "spectator",
        max: 100,
        min: 0,
        title: "Wine Spectator",
        Icon: SpectatorIcon
    },
    {
        code: "robert",
        max: 100,
        min: 0,
        title: "Robert Parker",
        Icon: RobertIcon
    }
];

export const SWEETNESS_OPTIONS: OptionType[] = [
    { label: "sweetnessOptions.2", value: 2 },
    { label: "sweetnessOptions.4", value: 4 },
    { label: "sweetnessOptions.6", value: 6 },
    { label: "sweetnessOptions.8", value: 8 },
    { label: "sweetnessOptions.10", value: 10 }
];
export const ACIDITY_OPTIONS: OptionType[] = [
    { label: "acidityOptions.2", value: 2 },
    { label: "acidityOptions.4", value: 4 },
    { label: "acidityOptions.6", value: 6 },
    { label: "acidityOptions.8", value: 8 },
    { label: "acidityOptions.10", value: 10 }
];
export const TANNIN_OPTIONS: OptionType[] = [
    { label: "tanninOptions.2", value: 2 },
    { label: "tanninOptions.4", value: 4 },
    { label: "tanninOptions.6", value: 6 },
    { label: "tanninOptions.8", value: 8 },
    { label: "tanninOptions.10", value: 10 }
];
