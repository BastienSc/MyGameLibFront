import { EditorDto } from "./editorDto";

export interface GameDialogDto{
    id: number;
    name: string;
    description: string;
    releaseDate: Date;
    editor: EditorDto;
    medias: File[];
}