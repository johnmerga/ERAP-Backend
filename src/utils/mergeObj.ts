export function mergeNestedObjects(obj1: Record<string, any>, obj2: Record<string, any>) {
    const mergedObj: any = {};

    for (let key in obj1) {
        if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
            mergedObj[key] = mergeNestedObjects(obj1[key], obj2[key]);
        } else if (obj2.hasOwnProperty(key)) {
            mergedObj[key] = obj2[key];
        } else {
            mergedObj[key] = obj1[key];
        }
    }

    for (let key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            mergedObj[key] = obj2[key];
        }
    }

    return mergedObj
}
