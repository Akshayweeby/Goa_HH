from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("cards", "0001_initial")]

    operations = [
        migrations.AlterField(model_name="card", name="name", field=models.CharField(max_length=30)),
        migrations.AlterField(model_name="card", name="role", field=models.CharField(max_length=30)),
    ]
