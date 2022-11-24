import { LanguageTabChanger } from "../../../../ui/organisms/LanguageTabChanger";
import { VideoStat } from "../molecules/VideoStat";
import { VideoPlayer } from "./VideoPlayer";

export const ManufacturerForm = () => (
    <section className="w-720p grid gap-y-50p">
        <section>
            <VideoStat />
            <LanguageTabChanger name="currentLang" />
        </section>

        <VideoPlayer />
    </section>
);
