# faq/urls.py
from django.urls import path
from .views import FAQSearchView, chat_bot_gem2

urlpatterns = [
    path('search/', FAQSearchView.as_view(), name='faq-search'),
    path('chat/',chat_bot_gem2.as_view(),name='chatbot')
]
