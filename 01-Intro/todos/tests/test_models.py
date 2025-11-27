from django.test import TestCase
from django.utils import timezone
from todos.models import Todo

class TodoModelTests(TestCase):

    def test_create_todo(self):
        todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date=timezone.now().date()
        )
        self.assertEqual(todo.title, "Test TODO")
        self.assertFalse(todo.resolved)

    def test_mark_resolved(self):
        todo = Todo.objects.create(title="Resolve me")
        todo.resolved = True
        todo.save()

        self.assertTrue(Todo.objects.get(id=todo.id).resolved)