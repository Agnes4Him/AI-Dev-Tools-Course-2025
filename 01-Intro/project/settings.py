"""
Django settings for project.
Generated manually for the TODO App tutorial.
"""

from pathlib import Path
import os

# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------
# Security (local dev defaults)
# ---------------------------------------------------------
SECRET_KEY = "django-insecure-change-this-key-for-production"
DEBUG = True

ALLOWED_HOSTS = []   # Add domain names if deploying

# ---------------------------------------------------------
# Installed Apps
# ---------------------------------------------------------
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Our application
    'todo',
]

# ---------------------------------------------------------
# Middleware (Admin requires sessions, auth, messages)
# ---------------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',       # REQUIRED
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',    # REQUIRED
    'django.contrib.messages.middleware.MessageMiddleware',       # REQUIRED
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ---------------------------------------------------------
# URL Configuration
# ---------------------------------------------------------
ROOT_URLCONF = 'project.urls'

# ---------------------------------------------------------
# Templates
# ---------------------------------------------------------
# Django will look in:
#  1. BASE_DIR / "templates"
#  2. each app's `templates/` directory because APP_DIRS=True
#
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],  # optional; app-level templates work too
        'APP_DIRS': True,                  # looks inside todo/templates/
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ---------------------------------------------------------
# WSGI
# ---------------------------------------------------------
WSGI_APPLICATION = 'project.wsgi.application'

# ---------------------------------------------------------
# Database (SQLite for simplicity)
# ---------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ---------------------------------------------------------
# Password Validation
# ---------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ---------------------------------------------------------
# Internationalization
# ---------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------
# Static Files
# ---------------------------------------------------------
STATIC_URL = 'static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",  # optional local static dir
]

STATIC_ROOT = BASE_DIR / "staticfiles"  # for collectstatic

# ---------------------------------------------------------
# Default primary key
# ---------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'