import {environment} from "../../environments/environment";

export function LoadYandexMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Проверяем, загружен ли скрипт уже
    if (document.getElementById('yandex-maps-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'yandex-maps-script';
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=package.full&apikey=${environment.yandexGeocodeAndMapKey}`;
    script.type = 'text/javascript';
    script.async = true;

    // Успешная загрузка
    script.onload = () => {
      resolve();
    };

    // Ошибка загрузки
    script.onerror = () => {
      reject(new Error('Failed to load Yandex Maps script.'));
    };

    // Добавляем скрипт в конец body
    document.body.appendChild(script);
  });
}
