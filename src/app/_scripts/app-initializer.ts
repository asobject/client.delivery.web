
import {LoadYandexMaps} from './yandex-maps-loader';

export async function appInitializerAsync(): Promise<void> {
  try {
    await LoadYandexMaps();
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
    return Promise.reject(error);
  }
}
