# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser
from django import forms
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import PinataCredentials
from django import forms
from .models import Case

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Email')

class CaseForm(forms.ModelForm):
    class Meta:
        model = Case
        fields = ['case_number', 'title', 'description', 'location', 'incident_date', 'notes']
        widgets = {
            'incident_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

class RegistrationForm(UserCreationForm):
    pinata_api_key = forms.CharField(max_length=255, required=True)
    pinata_api_secret = forms.CharField(max_length=255, required=True)
    pinata_jwt = forms.CharField(max_length=512, required=True, widget=forms.Textarea)

    class Meta:
        fields = ['username', 'email', 'password1', 'password2',
                'pinata_api_key', 'pinata_api_secret', 'pinata_jwt']

class PinataConnectForm(forms.ModelForm):
    class Meta:
        model = PinataCredentials
        fields = ['api_key', 'api_secret', 'jwt_token']
        widgets = {
            'jwt_token': forms.Textarea(attrs={'rows': 3}),
        }