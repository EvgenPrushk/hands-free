import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

import { ENV } from '../config/env';

/**
 * Общий интерфейс для запроса.
 * Вы можете дополнять его необходимыми полями (headers, params, и т.д.)
 */
export interface RequestConfig<T = any> {
  url: string;
  requestConfig?: AxiosRequestConfig<T>;
  // Здесь можно передать headers, params, cancelToken и т.д.
}

/**
 * Класс ApiService — тонкая обёртка над axios,
 * обеспечивает базовые REST-методы с единым инстансом и конфигом.
 */
class ApiService {
  private axiosInstance: AxiosInstance;

  private customParamsSerializer(params: Record<string, any>): string {
    return qs.stringify(params, {
      encode: true, // корректная энкодировка
      indices: false, // массивы будут сериализоваться как colors[]=id, colors[]=id2
      skipNulls: true, // пропускаем null/undefined
      arrayFormat: 'brackets', // явно указываем формат
    });
  }

  private trimObjectStrings<T extends Record<string, any>>(obj: T): T {
    // Убедимся, что пришёл объект и он не null
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Создаём новый объект или массив в зависимости от типа obj
    const newObj = (Array.isArray(obj) ? [] : {}) as T;

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];

      if (typeof value === 'string') {
        // Обрезаем пробелы у строк
        newObj[key] = value.trim() as any;
      } else if (Array.isArray(value)) {
        // Обрабатываем массив рекурсивно
        newObj[key] = this.trimObjectStrings(value as any) as any; // Рекурсивный вызов для элементов массива
      } else if (value && typeof value === 'object') {
        // Рекурсивно обрабатываем вложенный объект
        newObj[key] = this.trimObjectStrings(value as any) as any; // Рекурсивный вызов для вложенных объектов
      } else {
        // Копируем значения других типов как есть
        newObj[key] = value;
      }
    }
    return newObj;
  }

  constructor(baseURL: string = '') {
    this.axiosInstance = axios.create({
      baseURL,
      paramsSerializer: this.customParamsSerializer.bind(this),
    });
  }

  /**
   * Выполнить GET-запрос
   */
  public async get<T>({
    url,
    requestConfig = {},
  }: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, requestConfig);
  }

  /**
   * Выполнить POST-запрос
   */
  public async post<T>({
    url,
    requestConfig = {},
  }: RequestConfig): Promise<AxiosResponse<T>> {
    let processedData = requestConfig.data;
    if (requestConfig.data && typeof requestConfig.data === 'object') {
      processedData = this.trimObjectStrings(requestConfig.data);
    }
    return this.axiosInstance.post<T>(url, processedData, requestConfig);
  }

  /**
   * Выполнить PUT-запрос
   */
  public async put<T>({
    url,
    requestConfig = {},
  }: RequestConfig): Promise<AxiosResponse<T>> {
    let processedData = requestConfig.data;
    if (requestConfig.data && typeof requestConfig.data === 'object') {
      processedData = this.trimObjectStrings(requestConfig.data);
    }
    return this.axiosInstance.put<T>(url, processedData, requestConfig);
  }

  /**
   * Выполнить PATCH-запрос
   */
  public async patch<T>({
    url,
    requestConfig = {},
  }: RequestConfig): Promise<AxiosResponse<T>> {
    let processedData = requestConfig.data;
    if (requestConfig.data && typeof requestConfig.data === 'object') {
      processedData = this.trimObjectStrings(requestConfig.data);
    }
    return this.axiosInstance.patch<T>(url, processedData, requestConfig);
  }
  /**
   * Выполнить DELETE-запрос
   */
  public async delete<T>({
    url,
    requestConfig = {},
  }: RequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, requestConfig);
  }
}
// Создаём экземпляр класса с базовым URL (можно взять из .env или process.env)
const baseURL = ENV.medusaBackendUrl ?? '';
export const apiService = new ApiService(baseURL);