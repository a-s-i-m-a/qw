import { StylesConfig } from "react-select";

type IsMulti = false;

type OptionType = {
    label: string;
    value: string;
};

export const useSelectStyles = ({
    isError,
    isMulti
}: {
    isError?: boolean;
    isMulti?: boolean;
}): {
    styles: StylesConfig<OptionType, IsMulti>;
} => {
    const borderColor = isError ? "#FE8AAF" : "transparent";

    return {
        styles: {
            control: (styles, { isMulti, hasValue }) => ({
                ...styles,
                backgroundColor: "#F5F5FA",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                fontSize: "16px",
                fontWeight: "normal",
                boxShadow: "none",
                outline: "none",
                color: "#1C082A",
                flexWrap: "nowrap",

                padding:
                    isMulti && hasValue
                        ? "6px 6px 6px 18px"
                        : "11px 11px 11px 18px",
                "&:hover": {}
            }),
            menu: styles => ({
                ...styles,
                marginTop: "8px",
                backgroundColor: "#fff",
                border: "1px solid #E7E6F2",
                boxShadow: "none",
                borderRadius: "10px",
                zIndex: 30
            }),
            placeholder: (styles, { isDisabled }) => ({
                ...styles,
                color: isDisabled ? "#C5C5D6" : "#9D9DB6",
                fontWeight: "normal",
                fontSize: "16px"
            }),
            option: (styles, modificators) => ({
                ...styles,
                ...{
                    fontSize: "14px",
                    display: "block",
                    padding: "8px 8px 8px 18px",
                    transition: "all .2s",
                    background: modificators.isFocused ? "#F5F5FA" : "none",
                    color: modificators.isSelected ? "#A373C8" : "#1C082A",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minHeight: 38,

                    "&:hover": {
                        background: "#F5F5FA",
                        cursor: "pointer"
                    }
                }
            }),
            loadingIndicator: styles => ({
                ...styles,
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)"
            }),
            indicatorsContainer: styles => ({
                ...styles,
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)"
            }),
            singleValue: styles => ({
                ...styles,
                paddingRight: "36px"
            }),

            valueContainer: styles => ({
                ...styles,
                padding: "0px 45px 0px 0px"
            }),
            input: styles => ({
                ...styles,
                // width: "100%",
                flex: 1,
                padding: 0,
                margin: 0
            }),
            clearIndicator: styles => ({
                ...styles,
                cursor: "pointer"
            }),

            multiValue: styles => {
                return {
                    ...styles,
                    backgroundColor: "#B381D9",
                    borderRadius: "26px",
                    paddingLeft: "10px",
                    paddingRight: "5px",

                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px"
                };
            },
            multiValueLabel: styles => ({
                ...styles,
                fontSize: "15px",
                color: "#fff"
            }),
            multiValueRemove: styles => ({
                ...styles,
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                background: "white",
                color: "#B381D9",
                opacity: 0.5,
                transition: "opacity .2s",
                cursor: "pointer",
                marginLeft: "5px",
                ":hover": {
                    opacity: 1
                }
            })
        }
    };
};
