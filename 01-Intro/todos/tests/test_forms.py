from django.test import TestCase
from django.utils import timezone
from todos.forms import TodoForm

class TodoFormTests(TestCase):

    def test_form_valid_data(self):
        form = TodoForm(data={
            "title": "Test",
            "description": "Something",
            "due_date": timezone.now().date()
        })
        self.assertTrue(form.is_valid())

    def test_form_missing_title(self):
        form = TodoForm(data={
            "title": "",
            "description": "Something",
            "due_date": timezone.now().date()
        })
        self.assertFalse(form.is_valid())