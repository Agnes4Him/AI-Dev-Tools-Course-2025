from django.urls import path
from . import views

app_name = 'todo'

urlpatterns = [
    path('', views.TodoListView.as_view(), name='home'),
    path('add/', views.TodoCreateView.as_view(), name='add'),
]
