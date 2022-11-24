import { FC } from "react";
import { Navbar } from "../organisms/Navbar";


export const MainTemplate: FC = ({ children }) => {
    return (
        <main className="w-full min-h-864p min-w-1400p flex bg-gray-bg  overflow-y-hidden print:invisible">
            <Navbar />
            <section className="min-h-768p bg-white rounded-tl-30p ml-60 pt-50p pb-60p flex flex-col overflow-x-hidden flex-1">
                {children}
            </section>
        </main>
    );
};
