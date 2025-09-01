import {makeAutoObservable, runInAction } from "mobx";
import type { UserInfo } from "../types/types";
import { check, fetchMyInfo } from "../http/userAPI";

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
            this.setIsAuth(false);
            this.setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    async checkAuth() {
        try {
            const data = await check();
            runInAction(() => {
                this.setUser(data as UserInfo);
                this.setIsAuth(true);
                this.setServerError(false);
            });
        } catch (error) {
            console.error("Error during auth check:", error);
            runInAction(() => {
                this.setIsAuth(false);
                this.setUser(null);
                this.setServerError(true, 'Server is not responding. Please try again later.');
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