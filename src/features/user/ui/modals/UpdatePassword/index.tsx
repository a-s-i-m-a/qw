import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";

import { useModal } from "../../../../modalpage/hooks";
import { User } from "../../../../types";
import { userStore } from "../../../store/UserStore";

import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { getChangePasswordSchema } from "../../../schemas/ChangePasswordSchema";
import { joiResolver } from "@hookform/resolvers/joi";

interface UpdatePasswordModalProps {
    id: string;
}

export const UPDATE_PASSWORD_MODAL = "UPDATE_PASSWORD_MODAL";
export const UpdatePasswordModal: FC<UpdatePasswordModalProps> = observer(
    ({ id }) => {
        const { register, closeModal, activeModalId } = useModal();
        const { t } = useTranslation();

        const { updateProfilePassword } = useContext(userStore);

        const form = useForm({
            mode: "onChange",
            resolver: joiResolver(getChangePasswordSchema(t))
        });

        const { handleSubmit, formState, reset } = form;

        const { isDirty } = formState;

        useEffect(() => {
            if (activeModalId !== id) {
                reset();
            }
        }, [activeModalId, id, reset]);
        useEffect(() => {
            register({
                id
            });
        }, [id, register]);

        const handleFormClear = () => {
            reset({ oldPassword: "", password: "", repeatPassword: "" });
        };

        const onSubmit = async (values: Partial<User>) => {
            const { oldPassword, password } = values;

            try {
                await updateProfilePassword({ oldPassword, password });

                throwSuccessToast(
                    t("changesSaved"),
                    t("changesSavedSuccessfully")
                );

                closeModal();
                handleFormClear();
            } catch (err) {
                const err_id = err?.response?.data?.error?.id;

                if (err_id === Number("400.112")) {
                    throwErrorToast(t("error"), t("oldPwdIsntCorrectError"));
                } else {
                    throwErrorToast(t("error"), t("unknownError"));
                }
            }
        };

        const handleModalClose = () => {
            handleFormClear();
            closeModal();
        };

        if (activeModalId !== id) return null;
        return (
            <section className="w-390p h-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6 pb-0 mb-50p">
                    {t("passwordChanging")}
                </h4>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-30p px-6 mb-50p">
                            <FormInput
                                name="oldPassword"
                                label={t("currentPassword")}
                                type="password"
                            />
                            <FormInput
                                name="password"
                                label={t("password")}
                                type="password"
                            />
                            <FormInput
                                name="repeatPassword"
                                label={t("repeatPassword")}
                                type="password"
                            />
                        </div>

                        <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                            <Button
                                isDisabled={!isDirty}
                                htmlType="submit"
                                text={t("change")}
                            />
                            <Button
                                text={t("cancel_2")}
                                onClick={handleModalClose}
                                htmlType="button"
                                className="ml-4"
                                type="tertiary"
                            />
                        </div>
                    </form>
                </FormProvider>
            </section>
        );
    }
);
