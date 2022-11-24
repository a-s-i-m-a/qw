import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { authStore } from "../../../features/auth/store/AuthStore";
import { Avatar } from "../Avatar";

import { useHistory } from "react-router-dom";
import { ProfilePlaceholder } from "../illustration";
import { useTranslation } from "react-i18next";

export const NavUser = observer(() => {
    const { user } = useContext(authStore);
    const history = useHistory();
    const { t } = useTranslation();
    const goToProfilePage = () => {
        history.push("/me");
    };

    return (
        <>
            <section
                onClick={goToProfilePage}
                className="fixed bottom-0 bg-gray-bg mt-auto cursor-pointer flex items-center px-30p py-10"
            >
                {user?.photo && (
                    <Avatar
                        size="sm"
                        Placeholder={ProfilePlaceholder}
                        photoUrl={user!.photo?.url}
                        alt={user!.name}
                    />
                )}
                <section className="ml-14p flex flex-col">
                    <span className="text-base">{user!.name || "Unknown"}</span>
                    <span className="text-12 text-gray-text">
                        {t(`${user!.role}.plural_0`)}
                    </span>
                </section>
            </section>
        </>
    );
});
