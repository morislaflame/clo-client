import { makeAutoObservable, runInAction } from "mobx";
import type { 
  Product, 
  ProductFilters, 
  ProductResponse,
  Size,
  Color,
  ClothingType 
} from "../types/types";
import { 
  fetchProducts, 
  fetchProduct, 
  fetchSizes, 
  fetchColors, 
  fetchClothingTypes 
} from "../http/productAPI";

export default class ProductStore {
  // Продукты
  products: Product[] = [];
  currentProduct: Product | null = null;
  
  // Пагинация
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  limit = 20;
  
  // Фильтры
  filters: ProductFilters = {
    currency: 'KZT'
  };
  
  // Справочники
  sizes: Size[] = [];
  colors: Color[] = [];
  clothingTypes: ClothingType[] = [];
  
  // Состояние загрузки
  loading = false;
  filtersLoading = false;
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setProducts(products: Product[]) {
    this.products = products;
  }

  setCurrentProduct(product: Product | null) {
    this.currentProduct = product;
  }

  setPagination(currentPage: number, totalPages: number, totalCount: number) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalCount = totalCount;
  }

  setFilters(filters: Partial<ProductFilters>) {
    this.filters = { ...this.filters, ...filters };
  }

  setSizes(sizes: Size[]) {
    this.sizes = sizes;
  }

  setColors(colors: Color[]) {
    this.colors = colors;
  }

  setClothingTypes(clothingTypes: ClothingType[]) {
    this.clothingTypes = clothingTypes;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setFiltersLoading(loading: boolean) {
    this.filtersLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Actions
  async loadProducts(filters?: Partial<ProductFilters>) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const searchFilters: ProductFilters = {
        ...this.filters,
        ...filters,
        page: filters?.page || this.currentPage,
        limit: this.limit
      };

      const response: ProductResponse = await fetchProducts(searchFilters);
      
      runInAction(() => {
        this.setProducts(response.products);
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
      console.error("Error loading products:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки товаров');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadProduct(id: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const product = await fetchProduct(id);
      
      runInAction(() => {
        this.setCurrentProduct(product);
        this.setLoading(false);
      });

      return product;
    } catch (error: unknown) {
      console.error("Error loading product:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки товара');
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadFilters() {
    try {
      this.setFiltersLoading(true);
      
      const [sizes, colors, clothingTypes] = await Promise.all([
        fetchSizes(),
        fetchColors(),
        fetchClothingTypes()
      ]);
      
      runInAction(() => {
        this.setSizes(sizes);
        this.setColors(colors);
        this.setClothingTypes(clothingTypes);
        this.setFiltersLoading(false);
      });

      return { sizes, colors, clothingTypes };
    } catch (error: unknown) {
      console.error("Error loading filters:", error);
      
      runInAction(() => {
        this.setFiltersLoading(false);
      });
      
      throw error;
    }
  }

  // Фильтрация
  updateFilter(key: keyof ProductFilters, value: any) {
    this.setFilters({ [key]: value });
  }

  clearFilters() {
    this.setFilters({
      currency: 'KZT',
      page: 1
    });
  }

  applyFilters() {
    this.setFilters({ page: 1 }); // Сбрасываем страницу при новом поиске
    return this.loadProducts();
  }

  // Пагинация
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      return this.loadProducts({ page });
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
    const { currency, page, limit, ...activeFilters } = this.filters;
    return Object.values(activeFilters).some(value => 
      value !== undefined && value !== null && value !== ''
    );
  }
}
