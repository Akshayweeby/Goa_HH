"""
Root URL configuration for the Frame ID Generator.
API routes are prefixed with /api, health check at /health.
"""

from django.urls import include, path

from cards import views as card_views

urlpatterns = [
    path("api/", include("cards.urls")),
    path("health/", card_views.health, name="health"),
]
