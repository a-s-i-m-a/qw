export const getSalepointsArray = (
    obj: object,
) => {
    const retailerStoresArray: string[] = [];
    obj && Object.values(obj).forEach(id => {
        if (id) {
            retailerStoresArray.push(id as string);
        }
    });
    return retailerStoresArray
};