export default interface AccordionItem {
    /** The name of this item in the accordion. */
    name: string;

    /** Text to add to the existing title when this item is expanded. */
    titleAppend?: string;

    description?: string;

    /** The inline element to show when this item is expanded. */
    element?: JSX.Element;

    /** TODO: The standalone page this item references. */
    navigatesTo?: string;

    /** Whether to show the "Click to open in new page" button regardless of if an element is present. */
    showNavigationRegardlessOfElement?: boolean;

    /** Icon that shows before the name. */
    nameIconPrefix?: JSX.Element;
}
