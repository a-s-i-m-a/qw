export const cropImage = (url: string, width: number, height = width) => {
    const pixelRatio = Math.round(window.devicePixelRatio);
    return `${url}/${width * pixelRatio}x${height * pixelRatio}`;
};
