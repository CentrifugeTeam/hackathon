# Запуск приложения

## Развертка 
### Создать контейнер: 
    docker compose build
### Запустить контейнер:
    docker compose up

## После запуска на localhost будут доступны следующие адреса:
    http://localhost/api/docs - Rest API
    http://localhost:8002 - pgAdmin
    http://localhost:8080 - Клиент для worker сервиса
    http://localhost:8001 - клиент для Redis
    http://localhost/ - путь пользователя




## Конфигурация приложения
    вся конфигурация находится в .env файле