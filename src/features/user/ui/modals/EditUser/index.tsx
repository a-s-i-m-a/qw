import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { User } from "../../../../types";
import { UserAPI } from "../../../../utils/api/requests/user-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getUserEditSchema } from "../../../../utils/schemas/UserSchema";

interface UserEditModalProps {
    id: string;
}

export const USER_EDIT_MODAL = "USER_EDIT_MODAL";

export const UserEditModal: FC<UserEditModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: User;
    }>();
    const { t } = useTranslation();
    const form = useForm<User>({
        mode: "onChange",
        resolver: joiResolver(getUserEditSchema(t))
    });
    const { handleSubmit, formState, reset } = form;
    useEffect(() => {
        if (modalData && modalData.item) {
            if (modalData.item._id) {
                reset({
                    login: modalData.item.login,
                    email: modalData.item.email
                });
            } 
        }
    }, [id, modalData, reset]);
    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { isDirty, isValid } = formState;

    const { mutate, isLoading } = useMutation({
        fetchFn:  UserAPI.updateUser,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?._id) {
                throwSuccessToast(
                    t(`changesSaved`),
                    t(`changesSavedSuccessfully`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: User) => {
        mutate({
            email: values.email,
            phone: values.phone,
            _id: modalData?.item?._id || ""
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                { `${t("editing")} ${t("user.plural_2").toLowerCase()}`}
            </h4>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        label={t("phone")}
                        name="login"
                        className="mt-6 px-6 mb-30p w-full"
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        className="px-6 mb-12 w-full"
                    />
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={t("save")}
                            isDisabled={!isValid || !isDirty || isLoading}
                        />
                        <Button
                            text={t("cancel_2")}
                            type="tertiary"
                            className="ml-4"
                            htmlType="button"
                            onClick={closeModal}
                        />
                    </div>
                </form>
            </FormProvider>
        </section>
    );
});
