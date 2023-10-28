from django.http import JsonResponse
from .models import Match  # , ConsentRequest

def matches_list(request):
    matches = Match.objects.all()
    data = [{
        'id': match.id,
        'team1': match.team1.name,
        'team2': match.team2.name,
        'date_time': match.date_time
    } for match in matches]
    return JsonResponse(data, safe=False)

# def consent_requests(request, match_id):
#     requests = ConsentRequest.objects.filter(match_id=match_id)
#     data = [{
#         'id': req.id,
#         'status': req.get_status_display(),
#     } for req in requests]
#     return JsonResponse(data, safe=False)

