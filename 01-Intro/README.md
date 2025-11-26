## Steps
* Initialize UV

```bash
uv init
```

* Install django

```bash
uv add django
```

* Run tests

```bash
uv run python manage.py test
```

* Create migration and migrate

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

* Create superuser    # optional
```bash
uv run python manage.py createsuperuser
```

* Run application

```bash
uv run python manage.py runserver
```