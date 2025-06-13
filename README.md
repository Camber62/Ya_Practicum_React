# React Webpack Starter

Проект React с настройкой для деплоя на GitHub Pages.

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Деплой на GitHub Pages
npm run deploy
```

## Настройка для GitHub Pages

### 1. Обновите homepage в package.json

Замените `[ваше-имя-пользователя]` и `[имя-репозитория]` на ваши данные:

```json
{
  "homepage": "https://ваше-имя-пользователя.github.io/имя-репозитория"
}
```

### 2. Настройте GitHub Pages

1. Перейдите в настройки репозитория на GitHub
2. Найдите раздел "Pages" в боковом меню
3. В разделе "Source" выберите "Deploy from a branch"
4. Выберите ветку `gh-pages` и папку `/ (root)`
5. Нажмите "Save"

### 3. Деплой

После настройки, каждый push в ветку `main` или `master` будет автоматически деплоить проект на GitHub Pages.

Для ручного деплоя используйте:

```bash
npm run deploy
```

## Структура проекта

```
├── src/                 # Исходный код
├── public/             # Статические файлы
├── dist/               # Собранный проект (создается после build)
├── webpack/            # Конфигурация webpack
└── .github/workflows/  # GitHub Actions
```

## Технологии

- React 18
- TypeScript
- Webpack 5
- Redux Toolkit
- React Router
- SASS
- Jest + Testing Library
- Cypress 