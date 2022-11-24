import reduceFields, { reduceList } from "../utils/reduceList";

const lesson = [
    "name",
    { video: ["url", "name"] },
    {
        quiz: [
            {
                questions: [{ default: ["question", "answers"] }]
            }
        ]
    },
    "sortNumber"
];

const block = [
    "name",
    "description",
    "image",
    { lessons: ["name", "video", "quiz", "sortNumber"] },
    "sortNumber"
];

const certificate = [
    "name",
    { country: ["name"] },
    "countryId",
    "levelCount",
    "totalLevelCount",
    "status"
];

const level = [
    "sortNumber",
    "name",
    "description",
    { bonusLessons: ["name", { video: ["url", "name"] }, "sortNumber"] },
    "status",
    "certificateId"
];

const levelList = [
    "sortNumber",
    "name",
    "status"
]

export const certificateFields = reduceList(certificate);
export const certificateListFields = reduceFields({
    items: certificate
});

export const levelFields = reduceList(level);
export const levelListFields = reduceFields({
    items: levelList
});

export const blockFields = reduceList(block);
export const blockListFields = reduceFields({
    items: block
});

export const lessonFields = reduceList(lesson);
export const lessonListFields = reduceFields({
    items: lesson
});
