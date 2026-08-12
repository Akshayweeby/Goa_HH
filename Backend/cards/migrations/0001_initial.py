from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Card",
            fields=[
                ("share_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("image_path", models.CharField(max_length=500)),
                ("name", models.CharField(max_length=40)),
                ("role", models.CharField(max_length=60)),
                ("title", models.CharField(max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "cards"},
        ),
    ]
