import { PieChartData } from "../../../../types";

export const renderLegend = ({
    props,
    data
}: {
    props: any;
    data: PieChartData[];
}) => {
    const { payload } = props;
    return (
        <ul className="w-315p">
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    className="flex flex-row items-center text-14 my-15p"
                >
                    <div
                        className="w-2 h-2 border-0 rounded-full mr-12p"
                        style={{ backgroundColor: payload[index].color }}
                    />
                    <div className="flex flex-row justify-between w-full">
                        <p className="truncate w-230p">
                            {entry?.payload?.name ?? "—"}
                        </p>
                        {data?.length > 0 && data[0].percent !== 0 ? (
                            <p className="w-44p">{`${
                                payload[index].payload.value / 100
                            }%`}</p>
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
};
