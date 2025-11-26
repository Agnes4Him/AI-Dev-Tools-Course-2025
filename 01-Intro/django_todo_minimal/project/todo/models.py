from django.db import models
from django.urls import reverse

class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('todo:home')
