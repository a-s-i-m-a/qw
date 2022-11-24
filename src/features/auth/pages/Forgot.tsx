import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../ui/atoms/Button";
import { FormInput } from "../../../ui/atoms/FormInput";
import { Anchor } from "../../../ui/atoms/Anchor";
import { useEffect, useState } from "react";
import { SuccessRestore } from "../ui/molecules/SuccessRestore";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../../utils/api/requests/auth-requests";
import { throwErrorToast } from "../../../ui/organisms/Toaster";
import { useMutation } from "../../utils/hooks/useMutation";
import { joiResolver } from "@hookform/resolvers/joi";
import { getForgotSchema } from "../../utils/schemas/LoginSchema";

export const ForgotPage = () => {
    const { t } = useTranslation();
    const { state } = useLocation<Record<"login", string>>();

    const form = useForm({
        mode: "onChange",
        resolver: joiResolver(getForgotSchema(t))
    });
    const { handleSubmit, formState, watch, setValue } = form;
    const { isDirty, isValid } = formState;
    useEffect(() => {
        if (state && state.login) {
            setValue("login", state.login, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [setValue, state]);
    const [isSuccess, setSuccess] = useState(false);
    const { mutate, isLoading } = useMutation({
        fetchFn: AuthAPI.restorePassword,
        onSuccess: () => setSuccess(true),
        onError: () => throwErrorToast(t("error"), t("emailNotKnown"))
    });

    const onSubmit = async (formData: Record<"login", string>) => {
        mutate(formData);
    };

    if (isSuccess) {
        return <SuccessRestore login={watch("login")} />;
    }
    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-300p"
                style={{ marginTop: 131 }}
            >
                <h2 className="font-semibold text-18 mb-5">
                    {t("pwdProblems")}
                </h2>
                <span className="text-14 leading-5 mb-30p inline-block">
                    {t("refYourEmail")}
                </span>
                <FormInput
                    name="login"
                    label={t("yourEmail")}
                    autoFocus={true}
                />

                <Button
                    className="mt-10 mb-30p"
                    isFull={true}
                    text={t("resetPwd")}
                    isDisabled={!isDirty || !isValid || isLoading}
                />
                <Anchor
                    to={{
                        pathname: "/login",
                        state: { login: watch("login") }
                    }}
                >
                    {t("goBack")}
                </Anchor>
            </form>
        </FormProvider>
    );
};
