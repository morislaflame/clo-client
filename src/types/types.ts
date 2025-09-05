export interface UserInfo {
    id: number;
    email: string;
}

// Реэкспорт типов из productAPI для удобства
export type {
  Product,
  ProductFilters,
  ProductResponse,
  ClothingType,
  Collection,
  MediaFile,
  Size,
  Color
} from '../http/productAPI';