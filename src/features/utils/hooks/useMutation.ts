import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { throwErrorToast } from "../../../ui/organisms/Toaster";

export const useMutation = <TData extends object | void, FData extends object>({
    fetchFn,
    onSuccess,
    onError
}: {
    fetchFn: (arg: FData) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
}) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [data, setData] = useState<TData>();
    const { t } = useTranslation();
    const mutate = useCallback(
        async (formData: FData) => {
            setLoading(true);
            setError(false);
            try {
                const data = await fetchFn(formData);
                if (data) {
                    setData(data);
                }
                onSuccess && onSuccess(data ?? (undefined as TData));
            } catch (error) {
                setError(true);
                if (error.name === "NetworkError") {
                    throwErrorToast(t("error"), t("networkError"));
                } else {
                    onError && onError(error);
                }
            }
            setLoading(false);
        },
        [fetchFn, onError, onSuccess, t]
    );

    return { isLoading, isError, data, mutate };
};
