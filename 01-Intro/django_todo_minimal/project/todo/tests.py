from django.test import TestCase
from .models import Todo

class TodoTest(TestCase):
    def test_model(self):
        t=Todo.objects.create(title='Test')
        self.assertEqual(str(t),'Test')
