# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser
from django import forms
from .models import ForensicCase

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Email')

class ForensicCaseForm(forms.ModelForm):
    class Meta:
        model = ForensicCase
        fields = ['case_number', 'case_name', 'crime_type', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }