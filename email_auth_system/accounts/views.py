from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import CustomAuthenticationForm, CustomUserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Case
from .forms import CaseForm

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful!')
            return redirect('home')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {email}')
                return redirect('home')
            else:
                messages.error(request, 'Invalid email or password')
        else:
            messages.error(request, 'Invalid email or password')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login')

@login_required
def home(request):
    active_cases = Case.objects.filter(user=request.user, status='active').order_by('-created_at')
    closed_cases = Case.objects.filter(user=request.user, status='closed').order_by('-created_at')
    archived_cases = Case.objects.filter(user=request.user, status='archived').order_by('-created_at')
    
    selected_case = None
    case_id = request.GET.get('case_id')
    if case_id:
        selected_case = get_object_or_404(Case, id=case_id, user=request.user)
    
    return render(request, 'accounts/home.html', {
        'active_cases': active_cases,
        'closed_cases': closed_cases,
        'archived_cases': archived_cases,
        'selected_case': selected_case,
    })

@login_required
def create_case(request):
    if request.method == 'POST':
        form = CaseForm(request.POST)
        if form.is_valid():
            case = form.save(commit=False)
            case.user = request.user
            case.save()
            return redirect('home')
    else:
        form = CaseForm()
    return render(request, 'accounts/create_case.html', {'form': form})

@login_required
def update_case(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    if request.method == 'POST':
        form = CaseForm(request.POST, instance=case)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = CaseForm(instance=case)
    return render(request, 'accounts/update_case.html', {'form': form, 'case': case})

@login_required
def delete_case(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    if request.method == 'POST':
        case.delete()
        return redirect('home')
    return render(request, 'accounts/delete_case.html', {'case': case})

@login_required
def change_case_status(request, pk, status):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    if status in ['active', 'closed', 'archived']:
        case.status = status
        case.save()
    return redirect('home')

# accounts/views.py
@login_required
def case_detail(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    return render(request, 'accounts/case_detail.html', {'case': case})