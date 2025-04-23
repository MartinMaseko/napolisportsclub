from django.urls import path
from . import views
from .views import (
    PlayerListCreateView,
    PlayerRetrieveUpdateDestroyView,
    DocumentCreateView,
    DocumentListView,
    DocumentRetrieveDestroyView,
    api_root,
    manage_data,
    register_player_as_user,
)

# URL patterns for the Napoli Club App
urlpatterns = [
    # Root API endpoint
    path('', api_root, name='api-root'),

    # Player-related URLs
    path(
        'players/', 
        PlayerListCreateView.as_view(), 
        name='player-list-create'
    ),  # List and create players
    path(
        'players/<int:pk>/', 
        PlayerRetrieveUpdateDestroyView.as_view(), 
        name='player-retrieve-update-destroy'
    ),  # Retrieve, update, or delete a specific player
    path(
        'players/<int:player_id>/register/', 
        register_player_as_user, 
        name='register-player-as-user'
    ),  # Register a player as a user

    # Document-related URLs
    path(
        'documents/', 
        DocumentListView.as_view(), 
        name='document-list'
    ),  # List all documents
    path(
        'documents/upload/', 
        DocumentCreateView.as_view(), 
        name='document-upload'
    ),  # Upload a new document
    path(
        'documents/<int:pk>/', 
        DocumentRetrieveDestroyView.as_view(), 
        name='document-retrieve-destroy'
    ),  # Retrieve or delete a specific document

    # Data management URLs
    path(
        'data/', 
        manage_data, 
        name='manage-data'
    ),  # Manage data
    path(
        'data/<int:pk>/', 
        PlayerRetrieveUpdateDestroyView.as_view(), 
        name='player-retrieve-update-destroy'
    ),  # Retrieve, update, or delete a specific player's data

    # Login URL
    path(
        'login/', 
        views.login, 
        name='login'
    ),  # Login endpoint
]