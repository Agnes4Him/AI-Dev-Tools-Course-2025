from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .models import Todo
from .forms import TodoForm

def home(request):
    todos = Todo.objects.all()
    return render(request, 'todo/home.html', {
        'todos': todos,
        'form': TodoForm(),
    })

def create_todo(request):
    if request.method == "POST":
        form = TodoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("todo:home")
    else:
        form = TodoForm()

    todos = Todo.objects.all()
    return render(request, "todo/home.html", {"form": form, "todos": todos})

def edit_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'POST':
        form = TodoForm(request.POST, instance=todo)
        if form.is_valid():
            form.save()
            return redirect('todo:home')   # ✔ ensure namespaced
    else:
        form = TodoForm(instance=todo)
    return render(request, 'todo/todo_form.html', {'form': form, 'todo': todo})

def delete_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'POST':
        todo.delete()
        return redirect('todo:home')  # ✔ ensure namespaced
    return render(request, 'todo/todo_confirm_delete.html', {'todo': todo})

def toggle_resolved(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.resolved = not todo.resolved
    todo.save()
    return redirect('todo:home')  # ✔ ensure namespaced