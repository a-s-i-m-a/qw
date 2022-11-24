import reduceFields from "../utils/reduceList";

const fields = [
        "hash",
        {product: ["name"]},
        {user: ["name"]},
        "isClaimed",
        "checkCount",
        "createDate"
];

export const productHashFields = reduceFields({items: fields});