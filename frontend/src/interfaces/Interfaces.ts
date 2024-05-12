
export interface RegisterResponse {
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
    folders: string[];
}

export interface Folder {
    sector: string;
    title: string;
    is_Exist: number;
}

export interface FolderResponse {
    message: string;
}