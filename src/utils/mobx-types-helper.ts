import {
    IAnyType,
    OptionalDefaultValueOrFunction,
    types,
    ValidOptionalValues,
} from "mobx-state-tree";

const FilePrimitive = types.custom<File, {}>({
    name: "File",
    fromSnapshot(value: File) {
        return value;
    },
    toSnapshot(value: File) {
        return value;
    },
    isTargetType(value: File | {}): boolean {
        return value instanceof File;
    },
    getValidationMessage(value: File): string {
        return "";
    },
});
const FileListPrimitive = types.custom<FileList, {}>({
    name: "FileList",
    fromSnapshot(value: FileList) {
        return value;
    },
    toSnapshot(value: FileList) {
        return value;
    },
    isTargetType(value: FileList | {}): boolean {
        return value instanceof FileList;
    },
    getValidationMessage(value: FileList): string {
        return "";
    },
});

function optional<
    IT extends IAnyType,
    OptionalVals extends ValidOptionalValues
>(type: IT, defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>) {
    return types.optional(
        types.union(type, types.null, types.undefined),
        defaultValueOrFunction,
        [null, undefined],
    );
}
export default { optional, FileListPrimitive, FilePrimitive };
