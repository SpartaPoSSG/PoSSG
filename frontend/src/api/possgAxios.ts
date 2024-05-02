import axios, { AxiosResponse, isAxiosError } from "axios";
import { EmailResponse, LoginResponse, RegisterResponse, User, Users } from "../interfaces/Interfaces";

const possgAxios = axios.create({
baseURL: "http://35.192.203.252:8000/api",
});

// 회원가입
export const register = async (
    email : string,
    password : string,
    nickname : string
): Promise<AxiosResponse<RegisterResponse, any> | null> => {
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
        if(isAxiosError<RegisterResponse>(error)) {
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

// 로그아웃