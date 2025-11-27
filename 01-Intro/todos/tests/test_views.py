from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from todos.models import Todo

class TodoViewsTests(TestCase):

    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test TODO",
            description="Testing",
            due_date=timezone.now().date(),
        )

    def test_home_view_lists_todos(self):
        url = reverse("todos:home")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "home.html")
        self.assertContains(response, "Test TODO")

    def test_create_todo(self):
        url = reverse("todos:create")
        response = self.client.post(url, {
            "title": "New TODO",
            "description": "New Desc",
            "due_date": timezone.now().date()
        })

        self.assertEqual(response.status_code, 302)  # redirected
        self.assertEqual(Todo.objects.count(), 2)
        self.assertTrue(Todo.objects.filter(title="New TODO").exists())

    def test_edit_todo(self):
        url = reverse("todos:edit", args=[self.todo.id])
        response = self.client.post(url, {
            "title": "Updated",
            "description": self.todo.description,
            "due_date": self.todo.due_date
        })

        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, "Updated")

    def test_delete_todo(self):
        url = reverse("todos:delete", args=[self.todo.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(id=self.todo.id).exists())

    def test_resolve_todo(self):
        url = reverse("todos:toggle_resolved", args=[self.todo.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.resolved)