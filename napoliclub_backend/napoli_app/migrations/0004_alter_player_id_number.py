# Generated by Django 5.2 on 2025-04-16 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('napoli_app', '0003_alter_player_id_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='id_number',
            field=models.CharField(max_length=13, unique=True),
        ),
    ]
