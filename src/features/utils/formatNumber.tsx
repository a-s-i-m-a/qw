import { renderToStaticMarkup } from "react-dom/server";
import NumberFormat, { NumberFormatProps } from "react-number-format";

export const formatNumber = (props: NumberFormatProps): string =>
    renderToStaticMarkup(
        <NumberFormat
            {...props}
            displayType="text"
            renderText={value => value.toString()}
        />
    );

export const formatThousands = (num: number) => {
    let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (result.split(".")[1] && result.split(".")[1].length === 1) {
        result += "0";
    }

    return result;
};

export const formatThousandsSpaces = (num: number) => {
    let result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    if (result.split(".")[1] && result.split(".")[1].length === 1) {
        result += "0";
    }

    return result;
};
