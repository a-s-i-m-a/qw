import { createContext, FC, useContext, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { QVinoLogo, RightGlass, LeftGlass } from "../../../ui/atoms/Icon";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/AuthStore";
import { OverlayLoader } from "../../../ui/atoms/OverlayLoader";
import { LanguageChanger } from "../../../ui/organisms/LanguageChanger";

export const AuthAnimationContext = createContext({
    handleSuccess: (sessionId: string) => undefined as void
});

export const AuthTemplate: FC = observer(({ children }) => {
    const { setSessionId } = useContext(authStore);
    const [isAnimationStarted, setAnimationStarted] = useState(false);
    const controls = useAnimation();
    useEffect(() => {
        controls.start({
            x: 0
        });
    }, [controls]);

    const handleSuccess = async (sessionId: string) => {
        setAnimationStarted(true);
        await controls.start({
            width: "100%",
            borderTopLeftRadius: 30,
            transition: {
                duration: 0.8,
                type: "spring"
            }
        });
        setSessionId(sessionId);
    };
    return (
        <AuthAnimationContext.Provider value={{ handleSuccess }}>
            <main className="relative min-h-screen w-screen flex justify-end items-stretch overflow-hidden bg-gray-bg">
                {isAnimationStarted && <OverlayLoader />}
                <motion.div
                    className="absolute left-32 top-32"
                    animate={{ opacity: isAnimationStarted ? 0 : 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <QVinoLogo />
                </motion.div>
                <motion.div
                    className="absolute left-32 bottom-0"
                    animate={{ x: 0, opacity: isAnimationStarted ? 0 : 1 }}
                    initial={{ x: 20, opacity: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <LeftGlass />
                </motion.div>
                <motion.div
                    className="absolute left-96 bottom-0"
                    animate={{ x: 0, opacity: isAnimationStarted ? 0 : 1 }}
                    initial={{ x: 10, opacity: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <RightGlass />
                </motion.div>

                <motion.section
                    className="flex flex-col bg-white w-700p px-20 z-10 ml-60"
                    initial={{ x: 100, borderTopLeftRadius: 0 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    animate={controls}
                >
                    <LanguageChanger className="mt-140p self-start" />
                    {!isAnimationStarted && children}
                </motion.section>
            </main>
        </AuthAnimationContext.Provider>
    );
});
