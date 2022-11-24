import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { App } from "./App";
import "./index.css";
import "./features/utils/i18n";
import { OverlayLoader } from "./ui/atoms/OverlayLoader";
import { Toaster } from "./ui/organisms/Toaster";
import { ModalPage } from "./features/modalpage";
import { CatalogueModals } from "./features/catalogue/ui/modals";
import { DirectoryModals } from "./features/directory/ui/modals";
import { UserModals } from "./features/user/ui/modals";
import { PromotionModals } from "./features/promotion/ui/modals";
import { TasksModals } from "./features/tasks/ui/modals";
import { ReviewModals } from "./features/reviews/ui/modals";
import { VideoModals } from "./features/videos/ui/modals";
import { GiftModals } from "./features/gifts/ui/modals";
import { ArticleModals } from "./features/articles/ui/modals";
import { DiscountModals } from "./features/discounts/ui/modals";
import { SalepointsModals } from "./features/salepoints/ui/modals";
import { OrdersModals } from "./features/orders/ui/modals";
import { CropperModals } from "./ui/organisms/CropperModal";
import { CoursesModals } from "./features/certificate/ui/modals";
import { WineryModals } from "./features/winery/ui/modals";

const history = createBrowserHistory();
ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <Suspense fallback={<OverlayLoader />}>
                <App />
                <Toaster />
                <ModalPage>
                    <CatalogueModals />
                    <DirectoryModals />
                    <PromotionModals />
                    <ReviewModals />
                    <VideoModals />
                    <ArticleModals />
                    <UserModals />
                    <TasksModals />
                    <GiftModals />
                    <DiscountModals />
                    <SalepointsModals />
                    <OrdersModals />
                    <CropperModals />
                    <CoursesModals />
                    <WineryModals />
                </ModalPage>
            </Suspense>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
