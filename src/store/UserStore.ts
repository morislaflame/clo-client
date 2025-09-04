import {makeAutoObservable, runInAction } from "mobx";
import type { UserInfo } from "../types/types";
import { check, fetchMyInfo, login, registration } from "../http/userAPI";

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
    _language = 'ru';

    constructor() {
        makeAutoObservable(this);
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

    setLanguage(lang: 'ru' | 'en') {
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

    async login(email: string, password: string) {
        try {
            this.setLoading(true);
            this.setServerError(false);
            
            const userData = await login(email, password);
            
            runInAction(() => {
                this.setUser(userData as UserInfo);
                this.setIsAuth(true);
                this.setLoading(false);
            });
            
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

    async register(email: string, password: string) {
        try {
            this.setLoading(true);
            this.setServerError(false);
            
            const userData = await registration(email, password);
            
            runInAction(() => {
                this.setUser(userData as UserInfo);
                this.setIsAuth(true);
                this.setLoading(false);
            });
            
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