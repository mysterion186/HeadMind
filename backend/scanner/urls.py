from django.urls import path

from scanner import views

urlpatterns = [
    path('upload/', views.upload_file_view, name='upload_file'),
]
