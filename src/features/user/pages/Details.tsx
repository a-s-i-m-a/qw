import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";

import { userStore } from "../store/UserStore";

import { uploadFile } from "../../utils/api/requests/file-requests";
import { MainSection } from "../ui/organisms/MainSection";
import { FC, useCallback, useContext, useEffect } from "react";

import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import { ProfilePlaceholder } from "../../../ui/atoms/illustration";
import { ImageUpload } from "../../../ui/atoms/ImageUpload";

import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { authStore } from "../../auth/store/AuthStore";
import { getUserSchema } from "../../utils/schemas/UserSchema";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { ExpertSection } from "../ui/organisms/ExpertSection";
import { UserPayload, UserSectionProps } from "../types";
import { transformUser } from "../utils/transformUser";
import { Role } from "../../types";
import { ManufacturerSection } from "../ui/organisms/ManufacturerSection";
import { RetailerSection } from "../ui/organisms/RetailerSection";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { UserDetails } from "../ui/organisms/UserDetails";
import { OrdersSection } from "../ui/organisms/OrdersSection";

const userDetails: Record<Role, FC<UserSectionProps>> = {
    admin: MainSection,
    owner: MainSection,
    user: MainSection,
    retailer: RetailerSection,
    moderator: MainSection,
    manufacturer: ManufacturerSection,
    expert: ExpertSection
};
export const Details = observer(() => {
    const { id } = useParams<Record<"id", string>>();
    const { t } = useTranslation();
    const history = useHistory();
    const isMe = !!useRouteMatch("/me");
    const isCreating = useRouteMatch("/user/create");

    const { load: refetchMeUser } = useContext(authStore);

    const {
        disableUserEditing,
        isUserEditing,
        loadUser,
        user,
        clear,
        setMe,
        updateOrCreateUser,
        enableUserEditing
    } = useContext(userStore);

    const formMethods = useForm<UserPayload>({
        mode: "onChange",
        resolver: joiResolver(getUserSchema(t))
    });

    const { handleSubmit, reset } = formMethods;
    const { dirtyFields } = formMethods.formState;
    useEffect(() => {
        if (isCreating) {
            enableUserEditing();
            isCreating && !user?.role && history.push("/users");
        }
    }, [enableUserEditing, history, isCreating, user]);

    useEffect(() => {
        isMe && setMe(true);
    }, [isMe, setMe]);

    useEffect(() => {
        !isCreating && loadUser(id);
    }, [id, isCreating, loadUser]);
    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        user && reset(transformUser(user));
    }, [reset, user]);

    const onSubmit = async (values: UserPayload) => {
        let photoId = values.photoId || null;
        if (values?.photo instanceof File) {
            const { _id } = await uploadFile(values?.photo);
            photoId = _id;
        }
        try {
            const updatedUser = await updateOrCreateUser({
                ...getDirtyFields(
                    {
                        ...values
                    },
                    dirtyFields
                ),
                role: values.role,
                photoId
            });

            if (isMe) {
                refetchMeUser();
            }
            throwSuccessToast(t("changesSaved"), t("changesSavedSuccessfully"));
            isCreating && history.push(`/user/${updatedUser._id}`);
            disableUserEditing();
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    const DetailsSection = useCallback(() => {
        const Component = userDetails[user?.role!];
        return <Component isMe={isMe} />;
    }, [user, isMe]);

    if (!user) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <DetailsHeader />
                {user.role === "user" ? (
                    <UserDetails />
                ) : (
                    <>
                        <ImageUpload
                            isDisabled={!isUserEditing}
                            EmptyState={ProfilePlaceholder}
                            name="photo"
                            alt={user?.name}
                        />
                        <DetailsSection />
                    </>
                )}
            </form>
            {user.role === "user" && <OrdersSection />}
        </FormProvider>
    );
});
