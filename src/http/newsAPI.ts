import { $host } from "./index";
import type { 
    News, 
    NewsType, 
    Tag, 
    NewsFilters, 
    NewsResponse, 
    NewsTypeResponse, 
    TagResponse 
} from "@/types/types";

// Новости
export const fetchNews = async (filters?: NewsFilters): Promise<NewsResponse> => {
    const { data } = await $host.get('api/news', { params: filters });
    return data;
};

export const fetchNewsById = async (id: number): Promise<News> => {
    const { data } = await $host.get(`api/news/${id}`);
    return data;
};

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

// Теги
export const fetchTags = async (page?: number, limit?: number, search?: string): Promise<TagResponse> => {
    const { data } = await $host.get('api/tag', { 
        params: { page, limit, search } 
    });
    return data;
};

export const fetchTagsWithCounts = async (): Promise<Tag[]> => {
    const { data } = await $host.get('api/tag/counts');
    return data;
};

export const fetchTagById = async (id: number): Promise<Tag> => {
    const { data } = await $host.get(`api/tag/${id}`);
    return data;
};
