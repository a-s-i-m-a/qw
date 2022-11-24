import { AxiosError } from "axios";
import { OptionType } from "../ui/atoms/Select";
import { TabOptions } from "../ui/organisms/TernaryTabList";

export type ArrayElement<
    ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface ListResponse<T> {
    items: T[];
    totalCount: number;
}
interface Issue<T> {
    path: (keyof T)[];
    rule: string;
    value: any;
    accept: any;
    current: any;
}
interface Error<T> {
    error: {
        id: number;
        code: string;
        message: string;
        data?: {
            issues?: Issue<T>[];
        };
    };
}

export interface FailedResponse<T> extends AxiosError<Error<T>> {}

export interface FileType {
    _id: string;
    url: string;
    name: string;
    type: string;
    contentLenght: number;
    contentType: string;
    createDate: string;
    isDeleted: boolean;
}

export const Roles = [
    "owner",
    "admin",
    "moderator",
    "expert",
    "manufacturer",
    "retailer",
    "user"
];
export type Role =
    | "owner"
    | "admin"
    | "moderator"
    | "expert"
    | "manufacturer"
    | "retailer"
    | "user";

export interface User {
    _id: string;
    login: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    photo: FileType | null;
    isOnline: boolean;
    lastActiveDate: string;
    status?: "initial" | "active";
    createDate?: string;
    updateDate?: string;
    isDeleted?: boolean;
    isBlocked: boolean;
    country: null | Country;
    countryId: null | string;
    manufacturer: Manufacturer | null;
    manufacturerId: string;
    retailer: Retailer | null;
    retailerId: string;
    photoId?: string | null;
    oldPassword?: string;
    password?: string;
}

export const Currencies = ["usd", "eur", "rub"];

export interface PriceType {
    value: number;
    currency: "usd" | "eur" | "rub" | "points";
    isConverted?: boolean;
}

export const Wines = ["red", "white", "sparkling", "rose", "port", "desert"];

export interface Country<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    iso: string;
    flag: string;
    requiresState?: boolean;
}
export interface Region<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    country: Country;
    countryId: string;
    createDate: string;
    isDeleted: boolean;
}

export interface GrapeSort<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    createDate: string;
    isDeleted: boolean;
}

export interface VineStyle<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
}

export const Gastronomies = [
    "grilledBeef",
    "beefStew",
    "leanMeat",
    "rawMeat",
    "friedFish",
    "bakedFish",
    "whiteOilyFish",
    "steamedFish",
    "lamb",
    "veal",
    "pork",
    "deer",
    "poultry",
    "mushrooms",
    "curedMeat",
    "goatCheese",
    "hardCheese",
    "softCheese",
    "pasta",
    "spicyFood",
    "aperitif",
    "snacks",
    "leanFish",
    "richFish",
    "shellFish",
    "vegetarian"
];
export type Languages = "ru" | "en" | "it" | "default";
export interface LangMap<DType extends unknown = string>
    extends Partial<Record<Languages, DType>> {
    default?: DType;
}
export interface Manufacturer<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    createDate: string;
    country: Country;
    countryId: string;
    isDeleted: boolean;
    logo: FileType | null;
    logoId: string | null;
    articleId: string;
    article: Article;
}

export interface AgentRating {
    code: string;
    rating: number;
}
export interface Product<useLangMap extends boolean = false> {
    _id: string;
    name: useLangMap extends true ? Partial<LangMap> : string;
    description: useLangMap extends true ? Partial<LangMap> : string;
    price: PriceType;
    newPrice: PriceType;
    photo: FileType;
    wineStyle: VineStyle;
    videoUrl: string;
    wineType: ArrayElement<typeof Wines>;
    vintage: number | null;
    volume: number;
    grapeSorts: GrapeSort[];
    region: Region;
    gastronomies: ArrayElement<typeof Gastronomies>[];
    bonusPoints: number;
    alcoholLevel: number | null;
    isAvailableForSale: boolean;
    awardYear: number | null;
    createDate: string;
    isDeleted: boolean;
    manufacturer: Manufacturer;
    qvinoRating: number;
    wineStyleId: string;
    grapeSortIds: string[];
    regionId: string;
    photoId: string | null;
    manufacturerId: string;
    agencyRatings: AgentRating[];
    stockCount: number | null;
    saleStatus: "none" | "awaitingModeration" | "inSale";
    videoId: string | null;
    video: Video;
    expertReviewId: string | null;
    expertReview: Review;
    hasDoubleBonusPoints: boolean;
    discountEndDate: string | null;
    isPromoted: boolean;
    status: boolean;
    scan1: number;
    scan2: number;
    repeated: number;
    sold: number;
    promoted: boolean;
    printedCount: number;
    altitude: number | null;
    recommendedYear: number | null;
    agingPotential: number | null;
    taste: Omit<ProductTaste, "body"> | null;
    isSoldByQvino: boolean;
}

export interface Answer {
    text: string;
    isCorrect: boolean;
}
export interface Question {
    question: string;
    answers: Answer[];

    // internal value. string because of radio value type
    correctAnswer: string;
}
export interface Quiz {
    _id: string;
    questions: LangMap<Question[]>;
    replyCount: number;
    isDeleted: string;
    createDate: string;
}
export interface Video {
    _id: string;
    expert: User;
    expertId: string;
    product: Product;
    productId: string;
    quiz: Partial<Quiz>;
    links: LangMap;
    createDate: string;
    isDeleted: boolean;
}
export const Tastes = [
    "aromatic",
    "floral",
    "fruity",
    "spice",
    "toasty",
    "herbal",
    "ethereal"
];
export type Taste =
    | "aromatic"
    | "floral"
    | "fruity"
    | "spice"
    | "toasty"
    | "herbal"
    | "ethereal";

interface ProductTaste {
    body: number;
    tannin: number;
    sweetness: number;
    acidity: number;
}
export interface Review {
    _id: string;
    type: "user" | "expert";
    user: User;
    userId: string;
    rating: number; // 0-50
    text: string;
    expertText: LangMap<string>;
    tasteScores: ProductTaste;
    tasteKinds: {
        first: Taste;
        second: Taste;
        third: Taste;
    };
    aftertasteDuration: number;
    aftertasteDescription: string;
    expertAftertasteDescription: LangMap<string>;
    lang: string;
    isDeleted: string;
    createDate: string;
    product: Product;
    productId: string;
}
export interface PromoInstrument {
    _id: string;
    type: "expertVideo" | "expertReview" | "bonusPoints" | "discount";
    video: Video;
    videoId: string;
    review: Review;
    reviewId: string;
    discountPrice: PriceType;
    endDate: string | null;

    //internal
    percent?: number;
    isEnabled?: boolean;
}
export interface Promo {
    _id: string;
    manufacturer: Manufacturer;
    product: Product;
    productId: string;
    status: "new" | "finished";
    instruments: Partial<PromoInstrument>[];
    viewCount: number;
    quizCount: number;
    createDate: string;
    isDeleted: boolean;
}

export type ExpertTaskStatuses = "pending" | "completed" | "accepted";
export interface ExpertTask {
    _id: string;
    type: "video" | "review";
    product: Product;
    productId: string;
    expert: User;
    expertId: string;
    videoUrl: string;
    review: Review;
    video: Video;
    status: ExpertTaskStatuses;
    createDate: string;
    isDeleted: boolean;
    reason: string | null;
}
export interface PricePoints {
    value: number;
    currency: string;
}

export type Lang = {
    Icon: string;
    label: string;
    value: Languages;
};
export interface Gift<useLangMap extends boolean = true> {
    _id?: string;
    name: useLangMap extends true ? LangMap<string> : string;
    description: LangMap<string>;
    pricePoints: number;
    price: PriceType;
    photo: FileType;
    stockCount: number;
    saleStatus: boolean;
    photoId?: string | null;
    photoUrl?: string;
    lang?: TabOptions | OptionType;
    createDate: string;
}

export interface Retailer {
    _id: string;
    name: string;
    logo: FileType;
    logoId: string | null;
    createDate: string;
}

export interface Block {
    type: string;
    body?: string;
    imageId?: string | File;
}

export interface Article {
    manufacturer: Manufacturer;
    _id?: string;
    description: LangMap<string>;
    cover: LangMap<FileType>;
    coverId: LangMap<string> | null;
    blocks: LangMap<Block[]>;
    quiz: Partial<Quiz>;
    manufacturerId: string;
    currentLang?: TabOptions | OptionType;
    createDate: string;
    quizCount: number;
    viewCount: number;
}

export interface Discounts<payload extends boolean = true> {
    _id?: string;
    name: string;
    description: string;
    imageId: string | File | null;
    image: FileType;
    country: payload extends true ? Country : OptionType;
    countryId: null | string;
    price: PriceType;
    retailerStoreIds: string[];
    createDate: string;
    status: "pending" | "accepted";
    retailer: Retailer;
}

export interface Location {
    address: string;
    city: string;
    coordinates: number[];
}
export interface Salepoint {
    _id: string;
    location: Location;
}

export interface Items<T> {
    product?: T;
    productId?: string;
    amount: number;
}

export interface BonusItems<T> {
    bonusProduct?: T;
    bonusProductId?: string;
    amount: number;
}
export interface DeliveryAddress<payload extends boolean = true> {
    phone?: string;
    country?: payload extends true ? Country : OptionType;
    state?: payload extends true ? string : OptionType;
    city?: string;
    address?: string;
    apartment?: string;
    zip?: string;
    countryId?: string;
}

export type OrderStatus =
    | "new"
    | "processing"
    | "sent"
    | "cancelled"
    | "completed";

export interface Order<payload extends boolean = true> {
    _id?: string;
    number: string;
    user?: User;
    manufacturer?: Partial<Manufacturer>;
    deliveryAddress?: payload extends true
        ? DeliveryAddress<false>
        : DeliveryAddress;
    items?: Items<Product>[];
    bonusProductItems?: BonusItems<Gift>[];
    createDate: string;
    sentDate?: string;
    cancelDate?: string;
    completeDate?: string;
    price?: PriceType;
    newPrice: PriceType;
    deliveryCost?: PriceType;
    total: PriceType;
    trackNumber?: string;
    status: OrderStatus;
    isQvinoOrder: boolean;
}

export interface BonusLesson {
    _id: string;
    name: string;
    video: File | FileType;
    sortNumber: number;
    videoId?: string;
}

export interface Lesson {
    _id: string;
    name: string;
    video: File | FileType;
    quiz: Quiz;
    progress: "closed" | "open" | "completed";
    sortNumber: number;
    certificateBlockId?: string;
    videoId?: string;
}

export interface LessonBlock {
    _id: string;
    name: string;
    description: string;
    image: File;
    imageId: string;
    lessons: Lesson[];
    progress: "closed" | "open" | "completed";
    lessonCount: number;
    complitedLessonCount: number;
    createDate: string;
    isDeleted: boolean;
    sortNumber: number;
    certificateLevelId?: string;
}

export interface Level {
    _id: string;
    name: string;
    description: string;
    blocks: LessonBlock[];
    bonusLessons: BonusLesson[];
    sortNumber: number;
    blockCount: number;
    completedBlockCount: number;
    progress: "closed" | "open" | "completed";
    status: "pending" | "published";
    createDate: string;
    isDeleted: boolean;
    certificateId?: string;
}

export interface Certificate<payload extends boolean = true> {
    _id: string;
    name?: string;
    country: payload extends true ? Country : OptionType;
    countryId: string;
    levelCount: number;
    totalLevelCount: number;
    status: "pending" | "published";
    createDate: string;
    isDeleted: boolean;
}

export type Currency = "usd" | "eur" | "rub";

export interface StatsData {
    sellsTotal: number;
    commissionTotal: number;
    completedOrderCount: number;
    cancelledOrderCount: number;
    timeline: Timeline[];
    sellsByCountry: PieChartData[];
}

export interface Timeline {
    date: string;
    sellsTotal: number;
    commissionTotal: number;
    completedOrderCount: number;
    cancelledOrderCount: number;
    cancelledSellsTotal: number;
}

export interface PieChartData {
    name: string;
    percent: number;
    count: number;
    total: number;
}

export interface ProductHash {
    _id: string;
    hash: string;
    product: Product;
    user: User;
    isClaimed: boolean;
    checkCount: number;
    createDate: string;
}
