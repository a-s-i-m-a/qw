
module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            transparent: "transparent",
            purple: {
                main: "#B381D9",
                light: "#C199E0",
                dark: "#A373C8",
                bg: "#F6EAFF",
                mainAlpha: "rgba(179, 129, 217, 0.5)"
            },
            yellow: "#FFE072",
            blue: "#B5C6FF",
            green: { main: "#83C6A6", light: "#E7FFEC" },
            gray: {
                main: "#C5C5D6",
                text: "#9D9DB6",
                bg: "#F5F5FA",
                light: "#EFEFF9"
            },
            "active-wrong": "#FD89AE",
            dark: {
                main: "#1C082A"
            },
            danger: "#FE8AAF",
            pink: "#FFE7EF",
            "status-blue": "#9EB4EC",
            white: "#FFFFFF",

            overlay: {
                main: {
                    dark: "rgba(28, 8, 42, 0.5)"
                }
            }
        },
        stroke: theme => ({
            gray: theme("colors.gray.text")
        }),
        backgroundImage: {
            "dashed-bdr": "url('/src/assets/svg/rectangle.svg')",
            "dashed-bdr-danger": "url('/src/assets/svg/rectangle-dnr.svg')",
            "dashed-line": "url('/src/assets/svg/line-dashed.svg')"
        },
        fontSize: {
            12: ["12px", { lineHeight: "15px", letterSpacing: "normal" }],
            14: ["14px", { lineHeight: "17px", letterSpacing: "normal" }],
            base: ["16px", { lineHeight: "22px", letterSpacing: "normal" }],
            18: ["18px", { lineHeight: "22px", letterSpacing: "normal" }],
            20: ["20px", { lineHeight: "24px", letterSpacing: "normal" }],
            24: ["24px", { lineHeight: "32px", letterSpacing: "normal" }],
            30: ["30px", { lineHeight: "36px", letterSpacing: "normal" }]
        },
        fontFamily: {
            primary: "Inter"
        },
        breakInside: [
            "auto",
            "avoid",
            "avoid-page",
            "avoid-column",
            "avoid-region"
        ],
        extend: {
            boxShadow: {
                dropdown: "0px 4px 14px -3px rgba(28, 8, 42, 0.1)",
                popper: "0px 3px 14px -3px rgba(28, 8, 42, 0.18)"
            },
            width: {
                header: "calc(100vw - 302px)",
                "700p": "700px",
                "600p": "600px",
                "300p": "300px",
                "390p": "390px",
                "482p": "482px",
                "144p": "144px",
                "565p": "565px",
                "552p": "552px",
                "200p": "200px",
                "720p": "720px",
                "340p": "340px",
                "150p": "150px",
                "540p": "540px",
                "210p": "210px",
                "290p": "290px",
                "230p": "230px",
                "500p": "500px",
                "277p": "277px",
                "220p": "220px",
                "64p": "64px",
                "54p": "54px",
                "8p": "8px",
                "315p": "315px",
                "285p": "285px",
                "92p": "92px",
                "44p": "44px",
                "35p": "35px",
                "212p": "212px",
                "138p": "138px",
                "22p": "22px",
                "374p": "374px",
                "46p": "46px",
                "50p": "50px",
                "555p": "555px",
                "490p": "490px",
                "175p": "175px",
                "238p": "238px"
            },
            maxWidth: {
                half: "50%",
                "335p": "335px",
                "300p": "300px"
            },
            spacing: {
                4.5: "18px",
                "3p": "3px",
                "30p": "30px",
                "34p": "34px",
                "35p": "35px",
                "33p": "33px",
                "28p": "28px",
                "140p": "140px",
                "11p": "11px",
                "12p": "12px",
                "5p": "5px",
                "22p": "22px",
                "50p": "50px",
                "55p": "55px",
                "60p": "60px",
                "40p": "40px",
                "10p": "10px",
                "14p": "14px",
                "26p": "26px",
                "20p": "20px",
                "6p": "6px",
                "150p": "150px",
                "18p": "18px",
                "25p": "25px",
                "17p": "17px",
                "38p": "38px",
                "42p": "42px",
                "83p": "83px",
                "15p": "15px",
                "46p": "46px",
                "36p": "36px",
                "52p": "52px",
                "8p": "8px",
                "130p": "130px",
                "135p": "135px",
                "185p": "185px",
                "100p": "100px"
            },
            height: {
                nav: "calc(100% - 248px)",
                "44p": "44px",
                "144p": "144px",
                "155p": "155px",
                "84p": "84px",
                "80p": "80px",
                "260p": "260px",
                "1p": "1px",
                "405p": "405px",
                "8p": "8px",
                "42p": "42px",
                "22p": "22px",
                "66p": "66px",
                "520p": "520px"
            },
            minHeight: {
                10: "2.5rem",
                "146p": "146px",
                "170p": "170px",
                "864p": "864px",
                "768p": "768px"
            },
            minWidth: { 
                "1400p": "1400px",
                "720p": "720px" 
            },
            inset: { 4.5: "18px", "23p": "23px", "70p": "70px" },
            zIndex: {
                "-1": -1,
                ...Array(15)
                    .fill(1)
                    .reduce((result, v, i) => {
                        const value = (i + 6) * 10; // 6 because tailwind already have zIndexes from 0 to 50
                        result[value] = value;
                        return result;
                    }, {})
            },
            letterSpacing: {
                0.01: "0.01em",
                "-0.01": "-0.01em"
            },
            borderRadius: {
                "10p": "10px",
                "30p": "30px",
                "20p": "20px",
                "12p": "12px",
                "14p": "14px"
            },
            screens: {
                print: { raw: "print" }
            }
        }
    },
    variants: {
        margin: ["first", "last"],
        padding: ["first", "last"],
        borderRadius: ["first", "last", "hover"],
        cursor: ["hover"],
        breakInside: ["responsive"]
    },
    plugins: [
        require("@tailwindcss/line-clamp"),
        require("tailwindcss-break")()
    ]
};
