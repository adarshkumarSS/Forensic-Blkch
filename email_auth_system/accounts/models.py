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

class ForensicCase(models.Model):
    CASE_STATUS = (
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    )
    
    CRIME_TYPES = (
        ('cyber', 'Cyber Crime'),
        ('homicide', 'Homicide'),
        ('fraud', 'Financial Fraud'),
        ('narcotics', 'Narcotics'),
        ('other', 'Other'),
    )
    
    case_number = models.CharField(max_length=50, unique=True)
    case_name = models.CharField(max_length=100)
    crime_type = models.CharField(max_length=20, choices=CRIME_TYPES)
    description = models.TextField()
    officer_in_charge = models.ForeignKey(User, on_delete=models.PROTECT)
    status = models.CharField(max_length=10, choices=CASE_STATUS, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.case_number} - {self.case_name}"


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