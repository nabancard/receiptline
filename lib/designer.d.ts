declare const designer: {
    initialize: () => void;
    insertText: (edit: HTMLTextAreaElement, text: string, lf?: boolean | undefined) => void;
};
export default designer;
