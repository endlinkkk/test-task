cd backend/project
# python manage.py runserver
daphne project.asgi:application --bind 0.0.0.0  --port 8000
