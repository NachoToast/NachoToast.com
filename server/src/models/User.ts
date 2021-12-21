export default interface User {
    id: string;
    name: string;
    nameLower: string;
    signedUp: number;
    lastLoggedIn: number;
    badges: {};
    achievements: {};
    profilePicture?: any;
    description?: string;
}
