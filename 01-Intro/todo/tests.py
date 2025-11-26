# todo/tests.py
from django.test import TestCase
from django.urls import reverse
from .models import Todo
from datetime import date

class TodoModelTest(TestCase):
    def test_create_todo_defaults(self):
        t = Todo.objects.create(title="Test")
        self.assertFalse(t.resolved)
        self.assertIsNone(t.due_date)
        self.assertIsNotNone(t.created_at)

class TodoViewsTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(title="Buy milk", description="2L", due_date=date(2100,1,1))

    def test_home_lists_todos(self):
        resp = self.client.get(reverse('todo:home'))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Buy milk")

    def test_create_todo_via_post(self):
        resp = self.client.post(reverse('todo:create'), {
            'title': 'New Task',
            'description': 'Details',
            'due_date': '',
            'resolved': False,
        })
        # after creation we redirect to home
        self.assertRedirects(resp, reverse('todo:home'))
        self.assertTrue(Todo.objects.filter(title='New Task').exists())

    def test_edit_todo(self):
        resp = self.client.post(reverse('todo:edit', args=[self.todo.pk]), {
            'title': 'Buy milk and bread',
            'description': self.todo.description,
            'due_date': self.todo.due_date,
            'resolved': False
        })
        self.assertRedirects(resp, reverse('todo:home'))
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Buy milk and bread')

    def test_delete_todo(self):
        resp = self.client.post(reverse('todo:delete', args=[self.todo.pk]))
        self.assertRedirects(resp, reverse('todo:home'))
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())

    def test_toggle_resolved(self):
        # initially unresolved
        self.assertFalse(self.todo.resolved)
        resp = self.client.post(reverse('todo:toggle', args=[self.todo.pk]))
        self.assertRedirects(resp, reverse('todo:home'))
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.resolved)

    def test_invalid_create_missing_title(self):
        resp = self.client.post(reverse("todo:create"), {"title": ""})
        self.assertEqual(resp.status_code, 200)  # NOT redirect
        self.assertFormError(resp, "form", "title", "This field is required.")
