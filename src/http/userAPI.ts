import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email: string, password: string) => {
    const { data } = await $host.post('api/user/registration', { email, password });
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),
    };
};

export const login = async (email: string, password: string) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),
    };
};

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return {
        ...jwtDecode(data.token),
    };
}

export const fetchMyInfo = async () => {
    const { data } = await $authHost.get('api/user/me');
    return data;
};

// Создание гостевого пользователя
export const createGuestUser = async () => {
    const { data } = await $host.post('api/user/guest');
    localStorage.setItem('token', data.token);
    localStorage.setItem('isGuest', 'true');
    return {
        ...jwtDecode(data.token),
        isGuest: true
    };
};

// Email аутентификация
export const sendRegistrationCode = async (email: string) => {
    const { data } = await $host.post('api/user/send-registration-code', { email });
    return data;
};

export const registerWithVerification = async (email: string, password: string, code: string) => {
    const { data } = await $host.post('api/user/register-with-verification', { 
        email, 
        password, 
        code 
    });
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),
    };
};

export const sendPasswordResetCode = async (email: string) => {
    const { data } = await $host.post('api/user/send-password-reset-code', { email });
    return data;
};

export const resetPasswordWithVerification = async (email: string, newPassword: string, code: string) => {
    const { data } = await $host.post('api/user/reset-password-with-verification', { 
        email, 
        newPassword, 
        code 
    });
    return data;
};