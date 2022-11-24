import { CANADA_PROVINCES, US_STATES } from './../consts';
import { OptionType } from '../../../ui/atoms/Select';

export const getOptions = (iso?: string ): OptionType[] | undefined => {
    if (iso === "CA") {
        return CANADA_PROVINCES.map(province => ({ label: `provinces.${province}`, value: province}))
    }
    if (iso === "US") {
        return US_STATES.map(state => ({label: `states.${state}`, value: state}))
    }
    return undefined
}