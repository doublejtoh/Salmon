export const getImageSizeJson = (width, height, targetWidth, a) => {
    const ratio = width / height;
    console.log(width, height);
    switch (ratio) {
        case 1:
            return {
                width: targetWidth,
                height: targetWidth,
            };
        default:
            console.log(a);
            return {
                width: targetWidth,
                height: (1 / ratio) * targetWidth,
            };
    }
}