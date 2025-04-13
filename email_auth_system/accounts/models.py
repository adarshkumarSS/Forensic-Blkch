from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model

def validate_email_domain(value):
    allowed_domains = [
        'tnpolice.gov.in',
        'forensic.tn.gov.in',
        'aij.gov.in',
        'nic.in',
        'tn.gov.in',
        'gov.in'
    ]
    
    domain = value.split('@')[-1]
    if domain not in allowed_domains:
        raise ValidationError(f"Email domain {domain} is not allowed. Please use an official email address.")

class CustomUser(AbstractUser):
    email = models.EmailField(
        unique=True,
        validators=[validate_email_domain]
    )
    
    def save(self, *args, **kwargs):
        self.username = self.email  # Use email as username
        super().save(*args, **kwargs)

User = get_user_model()

class Case(models.Model):
    CASE_STATUS = (
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    )

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    case_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=CASE_STATUS, default='active')
    location = models.CharField(max_length=100, blank=True)
    incident_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.case_number} - {self.title}"

    class Meta:
        ordering = ['-created_at']

class CaseFile(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='files')
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    pinata_cid = models.CharField(max_length=255)
    pinata_id = models.CharField(max_length=255)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_disclosure = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} (Case: {self.case.title})"

class PinataCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    jwt_token = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pinata credentials for {self.user.username}"