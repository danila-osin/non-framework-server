# NON FRAMEWORK SERVER

> #### Написал мини фреймворк. 
> Можно писать рауты и middleware. Присутствуют _json_ и _files парсеры_.
> Код находится в папке *lib*.
> #### В проекте не использовался ни один фреймворк

## Список зависимостей
    1. bcrypt
    2. ioredis
    3. mongoose
\*_для работы сервера нужен docker_

## Использование

```javascript
const app = createServer() - создать сервер
app.use(middleware) - добавить middleware

const router = createRouter() - создать раутер
router.get(url, ...middlewares) - создать раут
app.use(router.toMiddleware()) - добавить раут в middlewares
```

* Пользователи хранятся в `Mongo`
* Сессии - в `Redis`

------

## Запуск  
    1. yarn / yarn install
    2. yarn run:dbs / docker-compose up
    3. yarn start

## Рауты
   - `/register` 
     - input: `{"username": "...", "password": "..."}`
        
   - `/login`
     - input: `{"username": "...", "password": "..."}`
        
   - `/getUser` 
     - input: `{"username": "..."}`
        
   - `/logout` 
     - input: `{"username": "..."}`
        
   - `/uploadFile`
     - input: *form-data*
        
   - `/downloadFile`
     - input: `{"filename": "<filename>"}`
