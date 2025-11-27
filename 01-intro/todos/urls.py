from django.urls import path
from . import views

app_name = 'todos'

urlpatterns = [
    path('', views.home, name='home'),
    path('create/', views.todo_create, name='create'),
    path('edit/<int:pk>/', views.todo_edit, name='edit'),
    path('delete/<int:pk>/', views.todo_delete, name='delete'),
    path('toggle/<int:pk>/', views.todo_toggle_resolved, name='toggle_resolved'),
]