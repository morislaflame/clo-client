import {makeAutoObservable, runInAction } from "mobx";
import type { UserInfo } from "../types/types";
import { 
    check, 
    fetchMyInfo, 
    login, 
    registration,
    sendRegistrationCode,
    registerWithVerification,
    sendPasswordResetCode,
    resetPasswordWithVerification
} from "../http/userAPI";
import type BasketStore from "./BasketStore";

interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
    code?: string;
}

export default class UserStore {
    _user: UserInfo | null = null;
    _isAuth = false;
    _loading = false;
    isTooManyRequests = false;
    isServerError = false;
    serverErrorMessage = '';
    _language: 'ru' | 'en' | 'kz' = 'ru';

    constructor() {
        makeAutoObservable(this);
        // Инициализируем язык из localStorage
        const savedLanguage = localStorage.getItem('language') as 'ru' | 'en' | 'kz';
        if (savedLanguage && ['ru', 'en', 'kz'].includes(savedLanguage)) {
            this._language = savedLanguage;
        }
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool;
    }

    setUser(user: UserInfo | null) {
        this._user = user;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setTooManyRequests(flag: boolean) {
        this.isTooManyRequests = flag;
    }

    setServerError(flag: boolean, message: string = '') {
        this.isServerError = flag;
        this.serverErrorMessage = message;
    }

    setLanguage(lang: 'ru' | 'en' | 'kz') {
        this._language = lang;
        localStorage.setItem('language', lang);
    }

    async logout() {
        try {
            localStorage.removeItem('token');
            this.setIsAuth(false);
            this.setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    async login(email: string, password: string, basketStore?: BasketStore) {
        try {
            this.setLoading(true);
            this.setServerError(false);
            
            const userData = await login(email, password);
            
            runInAction(() => {
                this.setUser(userData as UserInfo);
                this.setIsAuth(true);
                localStorage.removeItem('isGuest'); // Убираем флаг гостя
                this.setLoading(false);
            });
            
            // Мигрируем локальную корзину на сервер
            if (basketStore) {
                try {
                    await basketStore.migrateLocalToServer();
                } catch (error) {
                    console.error('Error migrating basket:', error);
                }
            }
            
            return { success: true };
        } catch (error: unknown) {
            console.error("Error during login:", error);
            
            runInAction(() => {
                this.setLoading(false);
                this.setIsAuth(false);
                this.setUser(null);
                
                const err = error as ApiError;
                if (err.response?.status === 429) {
                    this.setTooManyRequests(true);
                } else {
                    this.setServerError(true, err.response?.data?.message || 'Login failed');
                }
            });
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Login failed' 
            };
        }
    }

    async register(email: string, password: string, basketStore?: BasketStore) {
        try {
            this.setLoading(true);
            this.setServerError(false);
            
            const userData = await registration(email, password);
            
            runInAction(() => {
                this.setUser(userData as UserInfo);
                this.setIsAuth(true);
                localStorage.removeItem('isGuest'); // Убираем флаг гостя
                this.setLoading(false);
            });
            
            // Мигрируем локальную корзину на сервер
            if (basketStore) {
                try {
                    await basketStore.migrateLocalToServer();
                } catch (error) {
                    console.error('Error migrating basket:', error);
                }
            }
            
            return { success: true };
        } catch (error: unknown) {
            console.error("Error during registration:", error);
            
            runInAction(() => {
                this.setLoading(false);
                this.setIsAuth(false);
                this.setUser(null);
                
                const err = error as ApiError;
                if (err.response?.status === 429) {
                    this.setTooManyRequests(true);
                } else {
                    this.setServerError(true, err.response?.data?.message || 'Registration failed');
                }
            });
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Registration failed' 
            };
        }
    }

    async checkAuth() {
        try {
            // Проверяем, есть ли токен в localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                // Нет токена - просто устанавливаем неавторизованное состояние
                runInAction(() => {
                    this.setIsAuth(false);
                    this.setUser(null);
                    this.setServerError(false);
                });
                return;
            }

            const data = await check();
            runInAction(() => {
                this.setUser(data as UserInfo);
                this.setIsAuth(true);
                this.setServerError(false);
            });
        } catch (error: unknown) {
            console.error("Error during auth check:", error);
            runInAction(() => {
                this.setIsAuth(false);
                this.setUser(null);
                
                // Различаем серверные ошибки от проблем с токеном
                const err = error as ApiError;
                if (err.response?.status === 401 || err.response?.status === 403) {
                    // Невалидный токен - удаляем его и не показываем ошибку
                    localStorage.removeItem('token');
                    this.setServerError(false);
                } else if (err.code === 'NETWORK_ERROR' || !err.response) {
                    // Реальная серверная ошибка - показываем ошибку
                    this.setServerError(true, 'Server is not responding. Please try again later.');
                } else {
                    // Другие ошибки - не показываем глобальную ошибку
                    this.setServerError(false);
                }
            });
        }
    }

    async fetchMyInfo() {
        try {
            const data = await fetchMyInfo();
            runInAction(() => {
                this.setUser(data as UserInfo);
            });
            
        } catch (error) {
            console.error("Error during fetching my info:", error);
        }
    }

    // Отправка кода подтверждения для регистрации
    async sendRegistrationCode(email: string) {
        try {
            const result = await sendRegistrationCode(email);
            
            return { success: true, data: result };
        } catch (error: unknown) {
            console.error("Error sending registration code:", error);
            
            // Не устанавливаем глобальные ошибки для методов верификации
            // Обрабатываем только rate limiting
            const err = error as ApiError;
            if (err.response?.status === 429) {
                this.setTooManyRequests(true);
            }
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Failed to send verification code' 
            };
        }
    }

    // Регистрация с подтверждением кода
    async registerWithVerification(email: string, password: string, code: string, basketStore?: BasketStore) {
        try {
            const userData = await registerWithVerification(email, password, code);
            
            runInAction(() => {
                this.setUser(userData as UserInfo);
                this.setIsAuth(true);
                localStorage.removeItem('isGuest'); // Убираем флаг гостя
            });
            
            // Мигрируем локальную корзину на сервер
            if (basketStore) {
                try {
                    await basketStore.migrateLocalToServer();
                } catch (error) {
                    console.error('Error migrating basket:', error);
                }
            }
            
            return { success: true };
        } catch (error: unknown) {
            console.error("Error during registration with verification:", error);
            
            // Не устанавливаем глобальные ошибки для методов верификации
            // Обрабатываем только rate limiting
            const err = error as ApiError;
            if (err.response?.status === 429) {
                this.setTooManyRequests(true);
            }
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Registration failed' 
            };
        }
    }

    // Отправка кода для сброса пароля
    async sendPasswordResetCode(email: string) {
        try {
            const result = await sendPasswordResetCode(email);
            
            return { success: true, data: result };
        } catch (error: unknown) {
            console.error("Error sending password reset code:", error);
            
            // Не устанавливаем глобальные ошибки для методов верификации
            // Обрабатываем только rate limiting
            const err = error as ApiError;
            if (err.response?.status === 429) {
                this.setTooManyRequests(true);
            }
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Failed to send password reset code' 
            };
        }
    }

    // Сброс пароля с подтверждением кода
    async resetPasswordWithVerification(email: string, newPassword: string, code: string) {
        try {
            await resetPasswordWithVerification(email, newPassword, code);
            
            return { success: true };
        } catch (error: unknown) {
            console.error("Error during password reset:", error);
            
            // Не устанавливаем глобальные ошибки для методов верификации
            // Обрабатываем только rate limiting
            const err = error as ApiError;
            if (err.response?.status === 429) {
                this.setTooManyRequests(true);
            }
            
            return { 
                success: false, 
                error: (error as ApiError).response?.data?.message || 'Password reset failed' 
            };
        }
    }


    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get loading() {
        return this._loading;
    }

    get language() {
        return this._language;
    }
}