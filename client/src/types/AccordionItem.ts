export default interface AccordionResource {
    /** Appends to the existing title */
    path: string;

    /** Name of the item in the accordion itself, will fallback to path if absent. */
    displayName?: string;
    description?: string;

    element?: JSX.Element;
    navigatesTo?: string;
}
