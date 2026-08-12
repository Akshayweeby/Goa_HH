from django.db import models


class Card(models.Model):
    share_id = models.CharField(max_length=32, primary_key=True)
    image_path = models.CharField(max_length=500)
    name = models.CharField(max_length=30)
    role = models.CharField(max_length=30)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cards"

    def __str__(self) -> str:
        return self.share_id
