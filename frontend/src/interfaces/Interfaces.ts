
export interface RegisterResponse {
    message: string;
}

export interface LoginResponse {
    token: string;
}

export interface EmailResponse {
    isExist: boolean;
}

export interface Folder {
    sector: string;
    src: string;
    text: string;
}