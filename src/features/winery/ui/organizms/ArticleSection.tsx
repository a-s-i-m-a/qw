import { BlockSection } from "../../../articles/ui/organizms/BlockSection";
import { MainSection } from "../../../articles/ui/organizms/MainSection";

export const ArticleSection = () => {
    return (
        <section className="w-720p grid grid-cols-1 gap-y-40p">
            <MainSection viewOnly={true} />
            <BlockSection />
        </section>
    );
};
