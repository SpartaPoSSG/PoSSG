
export interface SuccessResponse {
    message: string;
}

export interface LoginResponse {
    token: string;
}

export interface EmailResponse {
    isExist: boolean;
}

export interface User {
    email: string;
    nickname: string;
}

export interface Users extends Array<User> {}

export interface Sector {
    name: string;
    folders: FolderData[];
}

export interface FolderData{
    title: string;
    src: string
}

export interface MySectors extends Array<Sector> {
    [key: string]: any;
}

export interface Folder {
    sector: string;
    title: string;
    new_title: string;
    is_Exist: number;
}

export interface MyFolder {
    sector: string;
    title: string;
    src: string;
}

export interface MyFolders extends Array<MyFolder> {}

export interface MyFolderDetail {
    sector: string;
    title: string;
    files: FileData[];
}

export interface MyFolderDetail2 {
    sector: string;
    title: string;
    file_name: string;
}

export interface FileData {
    file: File;
    src: string;
}