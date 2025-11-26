from django.views.generic import ListView, CreateView
from django.urls import reverse_lazy
from .models import Todo
from .forms import TodoForm

class TodoListView(ListView):
    model = Todo
    template_name = 'todo/home.html'
    context_object_name = 'todos'

class TodoCreateView(CreateView):
    model = Todo
    form_class = TodoForm
    template_name = 'todo/todo_form.html'
    success_url = reverse_lazy('todo:home')
