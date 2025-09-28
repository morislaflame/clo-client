import { makeAutoObservable, runInAction } from "mobx";
import type { 
  Collection, 
  CollectionFilters, 
  CollectionResponse
} from "../http/collectionAPI";
import { 
  fetchCollections, 
  fetchCollection 
} from "../http/collectionAPI";

export default class CollectionStore {
  // Коллекции
  collections: Collection[] = [];
  currentCollection: Collection | null = null;
  
  // Пагинация
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  limit = 20;
  
  // Фильтры
  filters: CollectionFilters = {};
  
  // Состояние загрузки
  loading = false;
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setCollections(collections: Collection[]) {
    this.collections = collections;
  }

  setCurrentCollection(collection: Collection | null) {
    this.currentCollection = collection;
  }

  setPagination(currentPage: number, totalPages: number, totalCount: number) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalCount = totalCount;
  }

  setFilters(filters: Partial<CollectionFilters>) {
    this.filters = { ...this.filters, ...filters };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Actions
  async loadCollections(filters?: Partial<CollectionFilters>) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const searchFilters: CollectionFilters = {
        ...this.filters,
        ...filters,
        page: filters?.page || this.currentPage,
        limit: this.limit
      };
      const response: CollectionResponse = await fetchCollections(searchFilters);
      
      runInAction(() => {
        this.setCollections(response.collections);
        this.setPagination(
          response.currentPage, 
          response.totalPages, 
          response.totalCount
        );
        this.setFilters(searchFilters);
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading collections:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки коллекций');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadCollection(id: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const collection = await fetchCollection(id);
      
      runInAction(() => {
        this.setCurrentCollection(collection);
        this.setLoading(false);
      });

      return collection;
    } catch (error: unknown) {
      console.error("Error loading collection:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки коллекции');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  // Фильтрация
  updateFilter(key: keyof CollectionFilters, value: string | number | boolean | undefined) {
    this.setFilters({ [key]: value });
  }

  clearFilters() {
    this.setFilters({
      page: 1
    });
  }

  applyFilters() {
    this.setFilters({ page: 1 }); // Сбрасываем страницу при новом поиске
    return this.loadCollections();
  }

  // Пагинация
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      return this.loadCollections({ page });
    }
  }

  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    return this.goToPage(this.currentPage - 1);
  }

  // Getters
  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  get hasPrevPage() {
    return this.currentPage > 1;
  }

  get isFilterApplied() {
    const { ...activeFilters } = this.filters;
    return Object.values(activeFilters).some(value => 
      value !== undefined && value !== null 
    );
  }
}
