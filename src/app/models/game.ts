export interface Game {
    id: number;
    name: string;
    description: string;
    releaseDate: Date;
    editorId: number;
    logo: any | null;
}