import { Spinner } from "../Spinner";

export const OverlayLoader = () => (
    <div className="absolute z-20 min-h-screen w-screen bg-dark-main bg-opacity-5 flex items-center justify-center">
        <Spinner />
    </div>
);
