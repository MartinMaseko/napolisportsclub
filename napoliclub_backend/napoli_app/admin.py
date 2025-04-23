from django.contrib import admin
from .models import Player, Document  # Import models

# Registered models.
admin.site.register(Player)
admin.site.register(Document)