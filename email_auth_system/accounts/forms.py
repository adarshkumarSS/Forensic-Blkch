# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser
from django import forms
from .models import ForensicCase
from django import forms
from .models import Case

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

class CaseForm(forms.ModelForm):
    class Meta:
        model = Case
        fields = ['case_number', 'title', 'description', 'location', 'incident_date', 'notes']
        widgets = {
            'incident_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }