from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .forms import (
    CustomAuthenticationForm, 
    CustomUserCreationForm,
    CaseForm,
    PinataConnectForm
)
from .models import Case, CaseFile, PinataCredentials
import requests
import json

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Save Pinata credentials if provided
            api_key = request.POST.get('pinata_api_key')
            api_secret = request.POST.get('pinata_api_secret')
            jwt_token = request.POST.get('pinata_jwt')
            
            if api_key and api_secret and jwt_token:
                PinataCredentials.objects.create(
                    user=user,
                    api_key=api_key,
                    api_secret=api_secret,
                    jwt_token=jwt_token
                )
            
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
    
    has_pinata_creds = PinataCredentials.objects.filter(user=request.user).exists()
    
    return render(request, 'accounts/home.html', {
        'active_cases': active_cases,
        'closed_cases': closed_cases,
        'archived_cases': archived_cases,
        'selected_case': selected_case,
        'has_pinata_creds': has_pinata_creds
    })

@login_required
def create_case(request):
    if request.method == 'POST':
        form = CaseForm(request.POST)
        if form.is_valid():
            case = form.save(commit=False)
            case.user = request.user
            case.save()
            messages.success(request, 'Case created successfully!')
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
            messages.success(request, 'Case updated successfully!')
            return redirect('home')
    else:
        form = CaseForm(instance=case)
    return render(request, 'accounts/update_case.html', {'form': form, 'case': case})

@login_required
def delete_case(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    if request.method == 'POST':
        case.delete()
        messages.success(request, 'Case deleted successfully!')
        return redirect('home')
    return render(request, 'accounts/delete_case.html', {'case': case})

@login_required
def change_case_status(request, pk, status):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    if status in ['active', 'closed', 'archived']:
        case.status = status
        case.save()
        messages.success(request, f'Case status changed to {status}')
    return redirect('home')

@login_required
def case_detail(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    case_files = CaseFile.objects.filter(case=case)
    has_pinata_creds = PinataCredentials.objects.filter(user=request.user).exists()
    
    return render(request, 'accounts/case_detail.html', {
        'case': case,
        'files': case_files,
        'has_pinata_creds': has_pinata_creds
    })

@login_required
def pinata_connect(request):
    try:
        credentials = PinataCredentials.objects.get(user=request.user)
    except PinataCredentials.DoesNotExist:
        credentials = None

    if request.method == 'POST':
        form = PinataConnectForm(request.POST, instance=credentials)
        if form.is_valid():
            creds = form.save(commit=False)
            creds.user = request.user
            creds.save()
            messages.success(request, 'Pinata credentials saved successfully!')
            return redirect('home')
    else:
        form = PinataConnectForm(instance=credentials)

    return render(request, 'accounts/pinata_connect.html', {'form': form})

@login_required
def upload_file(request, pk):
    case = get_object_or_404(Case, pk=pk, user=request.user)
    
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            credentials = PinataCredentials.objects.get(user=request.user)
        except PinataCredentials.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Pinata credentials not configured'
            }, status=400)

        uploaded_file = request.FILES['file']
        is_disclosure = request.POST.get('is_disclosure', 'false') == 'true'

        # Prepare Pinata upload
        files = {'file': uploaded_file}
        headers = {
            'Authorization': f'Bearer {credentials.jwt_token}',
            'pinata_api_key': credentials.api_key,
            'pinata_secret_api_key': credentials.api_secret
        }

        try:
            # Upload to Pinata
            response = requests.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                files=files,
                headers=headers
            )
            response.raise_for_status()
            result = response.json()

            # Save to database
            case_file = CaseFile.objects.create(
                case=case,
                name=uploaded_file.name,
                file_type=uploaded_file.content_type,
                pinata_cid=result['IpfsHash'],
                pinata_id=result['id'],
                size=uploaded_file.size,
                is_disclosure=is_disclosure
            )

            return JsonResponse({
                'success': True,
                'file': {
                    'id': case_file.id,
                    'name': case_file.name,
                    'type': case_file.file_type,
                    'cid': case_file.pinata_cid,
                    'size': case_file.size,
                    'uploaded_at': case_file.uploaded_at.isoformat(),
                    'is_disclosure': case_file.is_disclosure,
                    'view_url': f'https://gateway.pinata.cloud/ipfs/{case_file.pinata_cid}'
                }
            })
        except requests.exceptions.RequestException as e:
            error_msg = str(e)
            if hasattr(e, 'response') and e.response:
                try:
                    error_details = e.response.json()
                    error_msg = error_details.get('error', {}).get('details', error_msg)
                except ValueError:
                    pass
            return JsonResponse({
                'success': False,
                'error': error_msg
            }, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

@login_required
def delete_file(request, case_pk, file_pk):
    case = get_object_or_404(Case, pk=case_pk, user=request.user)
    case_file = get_object_or_404(CaseFile, pk=file_pk, case=case)
    
    if request.method == 'DELETE':
        try:
            credentials = PinataCredentials.objects.get(user=request.user)
        except PinataCredentials.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Pinata credentials not configured'
            }, status=400)

        headers = {
            'Authorization': f'Bearer {credentials.jwt_token}',
            'pinata_api_key': credentials.api_key,
            'pinata_secret_api_key': credentials.api_secret
        }

        try:
            # Unpin from Pinata
            response = requests.delete(
                f'https://api.pinata.cloud/pinning/unpin/{case_file.pinata_cid}',
                headers=headers
            )
            response.raise_for_status()

            # Delete from database
            case_file.delete()

            return JsonResponse({'success': True})
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)