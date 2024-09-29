MANAGEPY = python backend/project/manage.py
DC = docker compose
ENV_FILE = --env-file .env
APP_FILE = docker_compose.yaml
EXEC = docker exec -it
APP_CONTAINER = main-app
LOGS = docker logs


.PHONY: app
app:
	${DC} -f ${APP_FILE} up --build -d


.PHONY: app-logs
app-logs:
	${LOGS} ${APP_CONTAINER} -f


.PHONY: app-down
app-down:
	${DC} -f ${APP_FILE} down


.PHONY: migrate
migrate:
	${EXEC} ${APP_CONTAINER} ${MANAGEPY} migrate


.PHONY: migrations
migrations:
	${EXEC} ${APP_CONTAINER} ${MANAGEPY} makemigrations


.PHONY: superuser
superuser:
	${EXEC} ${APP_CONTAINER} ${MANAGEPY} createsuperuser


.PHONY: collectstatic
collectstatic:
	${EXEC} ${APP_CONTAINER} ${MANAGEPY} collectstatic