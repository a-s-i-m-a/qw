import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Review } from "../../types";
import { PromosAPI } from "../../utils/api/requests/promos-requests";
import { ReviewExpertPayload } from "../types";
import { transformReviewPayload } from "../utils/transformReview";

export class ReviewStore {
    constructor() {
        makeAutoObservable(this);
    }

    review: Review | null = null;
    isEditing: boolean = false;

    clear = () => {
        this.review = null;
        this.isEditing = false;
    };

    loadReview = async (id: string) => {
        this.review = await PromosAPI.getReview(id);
    };

    setEditing = (flag: boolean) => {
        this.isEditing = flag;
    };
    updateOrCreateReview = async (
        values: ReviewExpertPayload
    ): Promise<Review> => {
        const formData = transformReviewPayload(values);
        let fn = PromosAPI.createReview;

        if (this.review) {
            fn = PromosAPI.updateReview;
        }

        const review = await fn(formData);
        this.review = review;
        return review;
    };
}

export const reviewStore = createContext(new ReviewStore());
