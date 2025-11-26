# todo/models.py
from django.db import models
from django.urls import reverse

class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['resolved', 'due_date', '-created_at']
        # unresolved first, then by due_date asc, then newest created first

    def __str__(self):
        return f"{self.title} ({'resolved' if self.resolved else 'open'})"

    def get_absolute_url(self):
        return reverse('todo:home')
