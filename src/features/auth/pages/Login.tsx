import { FormProvider, useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

import { AuthAnimationContext } from "../templates/AuthTemplate";
import { Button } from "../../../ui/atoms/Button";
import { useContext, useEffect } from "react";
import { FormInput } from "../../../ui/atoms/FormInput";
import { Anchor } from "../../../ui/atoms/Anchor";
import { AuthAPI } from "../../utils/api/requests/auth-requests";
import { throwErrorToast } from "../../../ui/organisms/Toaster";
import { useLocation } from "react-router-dom";
import { useMutation } from "../../utils/hooks/useMutation";
import { joiResolver } from "@hookform/resolvers/joi";
import { getLoginSchema } from "../../utils/schemas/LoginSchema";

export const LoginPage = observer(() => {
    const { handleSuccess } = useContext(AuthAnimationContext);
    const { t } = useTranslation();
    const { state } = useLocation<Record<"login", string>>();
    const form = useForm<{
        login: string;
        password: string;
    }>({
        mode: "onChange",
        resolver: joiResolver(getLoginSchema(t))
    });
    const { handleSubmit, formState, watch, setValue } = form;
    useEffect(() => {
        if (state && state.login) {
            setValue("login", state?.login, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [setValue, state]);
    const { isDirty, isValid } = formState;

    const { mutate, isLoading } = useMutation({
        fetchFn: AuthAPI.getSessionId,
        onSuccess: data => handleSuccess(data.sessionId),
        onError: () => throwErrorToast(t("error"), t("incorrectLogOrPwd"))
    });

    const onSubmit = async (formData: { login: string; password: string }) => {
        mutate(formData);
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-300p mt-140p flex flex-col"
            >
                <FormInput
                    name="login"
                    label={t("yourEmail")}
                    autoFocus={true}
                />
                <FormInput
                    name="password"
                    label={t("password")}
                    className="mt-30p"
                    type="password"
                />
                <Button
                    className="mt-10 mb-30p"
                    isFull={true}
                    text={t("enter")}
                    isDisabled={!isDirty || !isValid || isLoading}
                />
                <Anchor
                    to={{
                        pathname: "/forgot",
                        state: { login: watch("login") }
                    }}
                >
                    {t("forgotPwd")}
                </Anchor>
            </form>
        </FormProvider>
    );
});
