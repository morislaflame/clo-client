import { $host } from "./index";
import type { NewsType, NewsTypeResponse } from "@/types/types";

// Типы новостей
export const fetchNewsTypes = async (page?: number, limit?: number, search?: string): Promise<NewsTypeResponse> => {
    const { data } = await $host.get('api/news-type', { 
        params: { page, limit, search } 
    });
    return data;
};

export const fetchNewsTypesWithCounts = async (): Promise<NewsType[]> => {
    const { data } = await $host.get('api/news-type/counts');
    return data;
};

export const fetchNewsTypeById = async (id: number): Promise<NewsType> => {
    const { data } = await $host.get(`api/news-type/${id}`);
    return data;
};
