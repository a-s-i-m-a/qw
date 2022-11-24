import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { authStore } from "../../../features/auth/store/AuthStore";
import {
    CATALOGUE_REGEXEP,
    ROUTE_LINK_CATALOGUE
} from "../../../features/catalogue/routes";
import { catalogueStore } from "../../../features/catalogue/store/CatalogueStore";
import { certificatesStore } from "../../../features/certificate/store/CertificatesStore";
import { directoryStore } from "../../../features/directory/store/DirectoryStore";
import { giftOrdersStore } from "../../../features/giftOrders/store/GiftOrdersStore";
import { ordersStore } from "../../../features/orders/store/OrdersStore";
import { promotionStore } from "../../../features/promotion/store/PromotionStore";
import { statsStore } from "../../../features/stats/store/StatsStore";
import { ROUTE_LINK_TASKS, TASK_REGEXEP } from "../../../features/tasks/routes";
import { tasksStore } from "../../../features/tasks/store/TasksStore";
import { ROUTE_LINK_USERS, USER_REGEXEP } from "../../../features/user/routes";
import { userStore } from "../../../features/user/store/UserStore";
import { RIGHTS } from "../../../rights";
import {
    NavAdIcon,
    NavCatalogueIcon,
    NavDirectoryIcon,
    NavTasksIcon,
    NavGiftIcon,
    NavWineryIcon,
    NavOrdersIcon,
    NavSalepointsIcon,
    NavStatIcon,
    NavUsersIcon,
    QVinoLogoSmall,
    NavDiscountsIcon,
    NavCoursesIcon,
    NavGiftOrderIcon
} from "../../atoms/Icon";
import { NavItem } from "../../atoms/NavItem";
import { NavUser } from "../../atoms/NavUser";

export const Navbar: FC = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    const { clearPagination: cleanUsersTable } = useContext(userStore);
    const { clearPagination: cleanCatalogueTable } = useContext(catalogueStore);
    const { clearPagination: cleanPromotionTable } = useContext(promotionStore);
    const { clearPagination: cleanTasksTable } = useContext(tasksStore);
    const { clearPagination: cleanDirectoryTable } = useContext(directoryStore);
    const { clearPagination: cleanOrderTable } = useContext(ordersStore);
    const { clearPagination: cleanGiftOrderTable } = useContext(
        giftOrdersStore
    );
    const { clearPagination: cleanStats } = useContext(statsStore);
    const { clearPagination: cleanCertificatesTable } = useContext(
        certificatesStore
    );
    return (
        <nav className="w-60 flex flex-col flex-shrink-0 bg-gray-bg fixed top-0 bottom-0">
            <section className="fixed w-60 h-32 bg-gray-bg">
                <QVinoLogoSmall className="mt-14 ml-30p" />
            </section>
            <ul className="h-nav relative mt-130p mb-100p pl-22p overflow-y-auto">
                <NavItem
                    to="/stat"
                    label={t("stat")}
                    Icon={NavStatIcon}
                    userRole={user!.role}
                    roles={RIGHTS.stats}
                    pattern={/^\/(stat)/}
                    onLeave={cleanStats}
                />
                <NavItem
                    to="/orders"
                    label={t("orders.plural_1")}
                    Icon={NavOrdersIcon}
                    userRole={user!.role}
                    roles={RIGHTS.orders}
                    pattern={/^\/(orders)/}
                    onLeave={cleanOrderTable}
                />
                <NavItem
                    to="/gift-orders"
                    label={t("orders.giftOrders")}
                    Icon={NavGiftOrderIcon}
                    userRole={user!.role}
                    roles={RIGHTS.giftOrders}
                    pattern={/^\/(gift-orders)/}
                    onLeave={cleanGiftOrderTable}
                />
                <NavItem
                    to={ROUTE_LINK_USERS}
                    label={t("users")}
                    Icon={NavUsersIcon}
                    userRole={user!.role}
                    roles={RIGHTS.users}
                    pattern={USER_REGEXEP}
                    onLeave={cleanUsersTable}
                />
                <NavItem
                    to={ROUTE_LINK_CATALOGUE}
                    label={t("wineCatalogue")}
                    Icon={NavCatalogueIcon}
                    pattern={CATALOGUE_REGEXEP}
                    userRole={user!.role}
                    roles={RIGHTS.catalogue}
                    onLeave={cleanCatalogueTable}
                />
                <NavItem
                    to="/promotion"
                    label={t("promotion")}
                    Icon={NavAdIcon}
                    userRole={user!.role}
                    roles={RIGHTS.promotion}
                    pattern={/^\/(promotion|review|video|article)/}
                    onLeave={cleanPromotionTable}
                />
                <NavItem
                    to={ROUTE_LINK_TASKS}
                    label={t("task.plural_1")}
                    Icon={NavTasksIcon}
                    userRole={user!.role}
                    roles={RIGHTS.tasks}
                    pattern={TASK_REGEXEP}
                    onLeave={cleanTasksTable}
                />
                <NavItem
                    Icon={NavSalepointsIcon}
                    to="/salepoints"
                    label={t("salepoints.plural_1")}
                    userRole={user!.role}
                    roles={RIGHTS.salepoints}
                    pattern={/^\/(salepoints)/}
                />
                <NavItem
                    to="/gifts"
                    label={t("gifts")}
                    Icon={NavGiftIcon}
                    userRole={user!.role}
                    roles={RIGHTS.gifts}
                    pattern={/^\/(gifts)/}
                />
                <NavItem
                    to="/discounts"
                    label={t("discounts.plural_1")}
                    Icon={NavDiscountsIcon}
                    userRole={user!.role}
                    roles={RIGHTS.discounts}
                    pattern={/^\/(discounts)/}
                />
                <NavItem
                    to="/directory"
                    label={t("directories")}
                    Icon={NavDirectoryIcon}
                    userRole={user!.role}
                    roles={RIGHTS.directory}
                    onLeave={cleanDirectoryTable}
                />
                <NavItem
                    to="/certificates"
                    label={t("certificate.plural_1")}
                    Icon={NavCoursesIcon}
                    userRole={user!.role}
                    roles={RIGHTS.certificates}
                    pattern={/^\/(certificates)/}
                    onLeave={cleanCertificatesTable}
                />
                <NavItem
                    to="/winery"
                    label={t("winery.aboutWinery")}
                    Icon={NavWineryIcon}
                    userRole={user!.role}
                    roles={RIGHTS.winery}
                    onLeave={cleanDirectoryTable}
                />
            </ul>

            <NavUser />
        </nav>
    );
});
