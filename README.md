NON FRAMEWORK SERVER

Для своего же удобства написал мини фреймворк.
Благодаря этому намного удобнее писать рауты и мидлверы.
Код находится в попке lib
=================================================
const app = createSrerver() - создать сервер
app.use(middle) - добавить мидлвер

const router = createRouter() - создать раутер
=================================================

Пользователи хранятся в Mongo
Сессии - в Redis

Запуск: 
    1. yarn / yarn install
    2. yarn run:dbs / docker-compose up
    3. yarn start

Рауты: 
    1. /register 
        in: {"username": "...", "password": "..."}

    2. /login 
        in: {"username": "...", "password": "..."}
    
    3. /getUser 
        in: {"username": "..."}

    4. /logout 
        in: {"username": "..."}

    5. /uploadFile
        in: form-data
    
    6. /downloadFile
        in: {"filename": "<filename>"}