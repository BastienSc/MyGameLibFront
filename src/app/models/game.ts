import { EditorDto } from "./editorDto";

export interface Game {
    id: number;
    name: string;
    description: string;
    releaseDate: Date;
    editor?: EditorDto;
    logo: any | null;
}