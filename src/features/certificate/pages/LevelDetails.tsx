import { observer } from "mobx-react-lite";
import React, {
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from "react";
import { DropResult } from "react-beautiful-dnd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { PlayIcon } from "../../../ui/atoms/Icon";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { SortableTable } from "../../../ui/organisms/SortableTable";
import { Column } from "../../../ui/organisms/Table/types";
import { TabList } from "../../../ui/organisms/TabList";
import { BonusLesson, Lesson, LessonBlock } from "../../types";
import { CertificatesAPI } from "../../utils/api/requests/certificates-requests";
import { ROUTE_LINK_CERTIFICATES } from "../routes";
import { certificatesStore } from "../store/CertificatesStore";
import { EmptyCertificates } from "../ui/atoms/EmptyCertificates";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { PoppedMoreBonus } from "../ui/molecules/PoppedMoreBonus";
import { BlockList } from "../ui/organisms/BlockList";
import { reorder } from "../ui/organisms/BlockList/helper";
import { LevelSection } from "../ui/organisms/LevelSection";
import { transformBonusLesson } from "../utils/transform";

export const LevelDetails = observer(() => {
    const { t } = useTranslation();
    const {
        loadBlocks,
        loadLevel,
        level,
        isLoading,
        setBonusLesson,
        setBonusLessons,
        blocks,
        tab,
        setTab
    } = useContext(certificatesStore);
    const { id } = useParams<Record<"id", string>>();
    const [currentBlocks, setCurrentBlocks] = useState<{
        items: LessonBlock[];
    } | null>(null);
    const { pathname } = useLocation();
    const history = useHistory();
    const formMethods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });

    const columns: Column<BonusLesson>[] = useMemo(
        () => [
            {
                Header: t("certificate.number") as string,
                accessor: "_id",
                Cell: ({ index }) => index,
                width: 70,
                id: "number"
            },
            {
                Header: t("certificate.levelName") as string,
                accessor: "name",
                Cell: ({ row }) => (
                    <span className="w-full h-full flex flex-row items-center">
                        {row?.video && !(row?.video instanceof File) && (
                            <a
                                className="mr-14p focus:outline-none"
                                href={`${row?.video?.url}?sid=${localStorage["sessionId"]}`}
                                rel="noreferrer"
                                target="_blank"
                                onClick={e => e.stopPropagation()}
                            >
                                <PlayIcon />
                            </a>
                        )}
                        {row?.name}
                    </span>
                ),
                width: "3.5fr",
                id: "name"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => <PoppedMoreBonus item={row} />
            }
        ],
        [t]
    );

    const { reset } = formMethods;

    useEffect(() => {
        loadLevel(id);
        loadBlocks(id);
    }, [id, loadBlocks, loadLevel]);

    useEffect(() => {
        blocks && setCurrentBlocks({ ...blocks, items: [...blocks.items] });
    }, [blocks, id]);

    useEffect(() => {
        if (level) {
            reset({ ...level, sortNumber: level?.sortNumber + 1 });
        }
    }, [level, reset]);

    useEffect(() => {
        return () => setCurrentBlocks(null);
    }, [setCurrentBlocks]);

    const handleLessonClick = useCallback(
        (data: Lesson, blockId: string) => {
            history.push(
                `${ROUTE_LINK_CERTIFICATES}/level/block/${blockId}/${data?._id}`
            );
        },
        [history]
    );

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;
        if (level?.bonusLessons?.length) {
            const items = reorder(level?.bonusLessons, sourceIndex, destIndex);
            level &&
                CertificatesAPI.updateLevel({
                    id: level?._id,
                    formData: {
                        sortNumber: level?.sortNumber,
                        bonusLessons: transformBonusLesson(items)
                    }
                });
                setBonusLessons(items);
        }
    };

    const handleBonusLessonClick = useCallback(
        (data: BonusLesson) => {
            setBonusLesson(data);
            history.push(`${pathname}/${data?._id}`);
        },
        [history, pathname, setBonusLesson]
    );

    if (!level || isLoading) {
        return <PageSpinner />;
    }
    return (
        <FormProvider {...formMethods}>
            <form className="px-50p flex-1 flex flex-col">
                <DetailsHeader isCertificate={false} />
                <LevelSection />
                <TabList
                    className="mb-30p"
                    onChange={setTab}
                    activeIndex={tab}
                    options={[
                        t("certificate.blocks.plural_1"),
                        t("certificate.bonusVideo.plural_1")
                    ]}
                />
                {tab === 0 && (
                    <BlockList
                        data={currentBlocks}
                        setData={setCurrentBlocks}
                        isLoading={isLoading}
                        handleLessonClick={handleLessonClick}
                    />
                )}
                {tab === 1 && level?.bonusLessons && (
                    <SortableTable
                        columns={columns}
                        data={level?.bonusLessons}
                        isLoading={isLoading}
                        pageCount={1}
                        id="bonusLessons"
                        handleRowClick={handleBonusLessonClick}
                        CustomEmptyState={() => (
                            <EmptyCertificates page="bonusLesson" />
                        )}
                        onDragEnd={onDragEnd}
                        disablePagination={true}
                    />
                )}
            </form>
        </FormProvider>
    );
});
