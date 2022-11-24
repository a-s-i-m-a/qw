export const reorder = (
    list: any[],
    startIndex: number,
    endIndex: number,
    isLesson: boolean = false
) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const arr = isLesson
        ? result.map((item, index) => ({ ...item, sortNumber: index }))
        : result.map((item, index) => ({ ...item, sortNumber: index }));
    return arr;
};
