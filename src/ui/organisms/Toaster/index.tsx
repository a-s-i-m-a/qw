import { Slide, toast, ToastContainer } from "react-toastify";
import { ToastClose, ToastSuccess } from "../../atoms/Icon";

export const throwErrorToast = (title: string, message: string) => {
    toast.error(
        <div className="text-14 relative py-5 pr-5 pl-14">
            <ToastClose className="absolute top-5 left-5" />
            <h4 className="font-semibold">{title}</h4>
            {message && (
                <span className="leading-5 pt-3 whitespace-pre-wrap">
                    {message}
                </span>
            )}
        </div>,
        {
            toastId: title
        }
    );
};
export const throwSuccessToast = (title: string, message?: string) => {
    toast.success(
        <div className="whitespace-pre-wrap text-14 relative py-5 pr-5 pl-14">
            <ToastSuccess className="absolute top-5 left-5" />
            <h4 className="font-semibold">{title}</h4>
            {message && (
                <span className="leading-5 mt-3 inline-block">{message}</span>
            )}
        </div>,
        {
            toastId: title
        }
    );
};

export const Toaster = () => (
    <ToastContainer
        position="top-right"
        hideProgressBar={true}
        transition={Slide}
        closeButton={false}
        pauseOnFocusLoss={false}
    />
);
