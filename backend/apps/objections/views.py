from django.shortcuts import render, redirect
from .forms import ObjectionForm

def create_objection(request):
    if request.method == 'POST':
        form = ObjectionForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('some-view-name')  # Redirect to a success page or list view
    else:
        form = ObjectionForm()

    return render(request, 'objections/create_objection.html', {'form': form})

