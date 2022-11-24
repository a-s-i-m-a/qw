import reduceFields, { reduceList } from "../utils/reduceList";

const listFields = [
    "status",
    { product: ["name", { photo: ["url"] }, { manufacturer: ["name"] }] },
    "instruments",
    "createDate"
];

export const promoDetailsFields = reduceList([
    "status",
    {
        product: [
            "name",
            { photo: ["url"] },
            { manufacturer: ["name", { country: ["name"] }] },
            { region: ["name"] },
            { price: ["value", "currency"] },
            "bonusPoints",
            "isAvailableForSale",
            "saleStatus"
        ]
    },
    { manufacturer: ["name"] },
    { instruments: ["type"] }
]);

export const promosListFields = reduceFields({
    items: listFields
});
const videoDefaultFields = [
    { product: ["name", { manufacturer: ["name"] }, { photo: ["url"] }] },
    "createDate"
];
export const videoListFields = reduceFields({
    items: videoDefaultFields
});
export const videoListForExpertSelect = reduceFields({
    items: [{ expert: ["name"] }, "createDate"]
});
const videoFields = [
    { product: ["name"] },
    { expert: ["name"] },
    { links: ["ru", "en", "it"] },
    { youtubeVideoId: ["ru", "en", "it"] },
    {
        quiz: [
            {
                questions: [
                    { ru: ["question", "answers"] },
                    { en: ["question", "answers"] },
                    { it: ["question", "answers"] }
                ]
            }
        ]
    }
];
export const videoDetailsFields = reduceList(videoFields);

const taskDefailtFields = [
    { product: ["name", { photo: ["url"] }, { manufacturer: ["name"] }] },
    { expert: ["name"] },
    "createDate",
    "type"
];

export const tasksListFields = reduceFields({
    items: taskDefailtFields
});

const reviewFields = [
    "lang",
    { tasteScores: ["body", "tannin", "acidity", "sweetness"] },
    "tasteKinds",
    "text",
    "expertText",
    "aftertasteDescription",
    "expertAftertasteDescription",
    "rating",
    "aftertasteDuration",
    { product: ["name"] },
    { user: ["name"] }
];
// я их для чего то другого использовал
export const reviewDetailsFields = reduceList(reviewFields);

const taskFields = [
    "type",
    {
        product: [
            "name",
            "bonusPoints",
            "vintage",
            { manufacturer: ["name"] },
            { region: ["name"] },
            { photo: ["url"] },
            { price: ["value", "currency"] }
        ]
    },
    "status",
    { expert: ["name"] },
    "videoUrl",
    "lang",
    "reason",
    { review: reviewFields }
];
export const taskDetailsFields = reduceList(taskFields);

const reviewDefailtFields = [
    { product: ["name", { manufacturer: ["name"] }, { photo: ["url"] }] },
    "createDate"
];
export const reviewListFields = reduceFields({
    items: reviewDefailtFields
});
export const reviewListForExpertSelect = reduceFields({
    items: [{ user: ["name"] }, "createDate"]
});

export const articleListForSelect = reduceFields({
    items: [{ manufacturer: ["name"] }, "createDate"]
});

const articleDefaultFields = [
    { manufacturer: ["name", { country: ["name"] }, { photo: ["url"] }] },
    "description",
    {
        coverId: ["ru", "en", "it"]
    },
    {
        blocks: [
            { ru: ["type", "imageId", "body"] },
            { en: ["type", "imageId", "body"] },
            { it: ["type", "imageId", "body"] }
        ]
    },
    "quiz",
    "quizCount",
    "viewCount",
    "createDate",
    {
        quiz: [
            {
                questions: [
                    { ru: ["question", "answers"] },
                    { en: ["question", "answers"] },
                    { it: ["question", "answers"] }
                ]
            }
        ]
    }
];

export const articleListFields = reduceFields({
    items: articleDefaultFields
});

export const articleFields = reduceList(articleDefaultFields);
