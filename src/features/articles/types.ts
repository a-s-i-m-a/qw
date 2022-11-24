import { Block, LangMap, Quiz } from './../types';
import { OptionType } from "../../ui/atoms/Select";
import { FileType } from "../types";
import { TabOptions } from '../../ui/organisms/TernaryTabList';


export type ArticlePayload = {
    _id?: string;
    manufacturer: OptionType;
    manufacturerId: string;
    cover: LangMap<FileType> | LangMap<string>;
    coverId?: LangMap<string> | null;
    description: LangMap;
    blocks: LangMap<Block[]>;
    quiz: Partial<Quiz>;
    currentLang: TabOptions;
}