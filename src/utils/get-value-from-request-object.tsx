export const getValueFromRequestObject = (object: any, query: string, requestItemsIndex?: number) => {
    const queryArray = query.split(".");
    let value = { ...object };
    // console.log("getValueFromRequestObject", query, value);
    queryArray.forEach((key: string) => {
        if (key !== "request") {
            if (key === "requestItems") {
                value = value.requestItems[requestItemsIndex || 0];
            }
            else if (value[key] !== undefined) {
                value = value[key];
            }
        }
    });
    return value;
};
