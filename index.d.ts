import React from "react";
declare type UseWysimarkReturnValue = {
    initialMarkdown: string;
    getMarkdownRef: React.MutableRefObject<(() => string) | undefined>;
    getMarkdown: () => string;
};
/**
 * This allows you to create the `wysimark` object that you passs into the
 * `Wysimark` component.
 *
 * This object is important because it exposes the method `getMarkdown` which
 * you need to extract the markdown.
 */
export declare function useEditor(initialMarkdown: string): UseWysimarkReturnValue;
/**
 * The lazily loaded Wysimark component to place in an app.
 */
export declare function Editor({ editor, minHeight, maxHeight, scriptUrl, uploadPolicyUrl, app, folder, }: {
    editor: UseWysimarkReturnValue;
    minHeight?: number;
    maxHeight?: number;
    scriptUrl?: string;
    uploadPolicyUrl?: string;
    app: string;
    folder: string;
}): JSX.Element;
export {};
