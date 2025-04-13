from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    path('cases/create/', views.create_case, name='create_case'),
    path('cases/<int:pk>/', views.case_detail, name='case_detail'),  # Add this line
    path('cases/<int:pk>/update/', views.update_case, name='update_case'),
    path('cases/<int:pk>/delete/', views.delete_case, name='delete_case'),
    path('cases/<int:pk>/status/<str:status>/', views.change_case_status, name='change_case_status'),

    path('pinata/connect/', views.pinata_connect, name='pinata_connect'),
]
