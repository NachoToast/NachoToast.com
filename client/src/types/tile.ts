export interface Tile {
    name: string;
    imageSource?: string;
    imageAlt?: string;

    /** URL destination */
    destination?: string;
    hidden?: boolean;
}
