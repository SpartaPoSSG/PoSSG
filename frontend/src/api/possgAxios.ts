import axios, { AxiosResponse, isAxiosError } from "axios";
import { EmailResponse, Folder, LoginResponse, User, Users, MyFolders, MyFolder, Sector, SuccessResponse} from "../interfaces/Interfaces";


const possgAxios = axios.create({
baseURL: "http://35.192.203.252:8000/api",
});

// 회원가입
export const register = async (
    email : string,
    password : string,
    nickname : string
): Promise<AxiosResponse<SuccessResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/signup",
            {
                email,
                password,
                nickname,
            }
        );
        return response;
    } catch (error) {
        if(isAxiosError<SuccessResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 로그인
export const login = async (
    email : string,
    password : string
): Promise<AxiosResponse<LoginResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/login",
            {
                email,
                password,
            }
        );
        return response;
    } catch (error) {
        if(isAxiosError<LoginResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 이메일 중복확인
export const checkEmail = async (
    email : string
): Promise<AxiosResponse<EmailResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "members/check-email",
            { email }
        );
        return response;
    } catch (error) {
        if(isAxiosError<EmailResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 회원정보 전체 반환
export const users = async (
): Promise<AxiosResponse<Users, any> | null> => {
    try {
        const response = await possgAxios.get(
            "members/list"
        );
        return response;
    } catch (error) {
        if(isAxiosError<Users>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 내 정보 반환
export const user = async (
    token: string
): Promise<AxiosResponse<User, any> | null> => {
    try {
        const response = await possgAxios.get(
            "members/member",
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response;
    } catch (error) {
        if(isAxiosError<User>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 폴더 생성(0), 수정(1), 삭제(2)
export const manageFolder = async (
    token: string,
    folderData: Folder
): Promise<AxiosResponse<SuccessResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "community/create",
            folderData,
            { headers: { Authorization: `Bearer ${token}` }},
        );
        return response;
    } catch (error) {
        if(isAxiosError<SuccessResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 썸네일 관련 API함수
export const uploadThumbnail = async (
    token: string,
    formData: FormData
): Promise<AxiosResponse<SuccessResponse, any> | null> => {
    try {
        const response = await possgAxios.post(
            "community/thumbnail-upload",
            formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        if(isAxiosError<SuccessResponse>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

// 내 폴더 정보 반환
export const getMyFolder = async (
    token: string
): Promise<AxiosResponse<MyFolders, any> | null> => {
    try {
        const response = await possgAxios.get(
            "community/folder",
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response;
    } catch (error) {
        if(isAxiosError<MyFolders>(error)) {
            console.log(`Error: ${error.response?.status} ${error.message}`);
            return null;
        } else {
            return null;
        }
    }
};

export const transformFolders = (folders: MyFolder[]): Sector[] => {
    const sectorMap: { [key: string]: { title: string; src: string }[] } = {};

    folders.forEach(folder => {
        if (!sectorMap[folder.sector]) {
            sectorMap[folder.sector] = [];
        }
        sectorMap[folder.sector].push({ title: folder.title, src: folder.src }); // 썸네일 URL을 포함한 폴더 정보를 추가
    });

    return Object.keys(sectorMap).map(sector => ({
        name: sector,
        folders: sectorMap[sector]
    }));
};

