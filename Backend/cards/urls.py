from django.urls import path

from . import views

urlpatterns = [
    path("generate", views.generate_card, name="generate-card"),
    path("card/<str:share_id>", views.card_page, name="card-page"),
    path("card/<str:share_id>/image", views.card_image, name="card-image"),
    path("card/<str:share_id>/back-image", views.card_back_image, name="card-back-image"),
    path("card/<str:share_id>/share-image", views.card_share_image, name="card-share-image"),
    path("", views.health, name="health"),
]
