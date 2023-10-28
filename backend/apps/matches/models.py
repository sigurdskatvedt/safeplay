from django.db import models

from django.db import models
from apps.teams.models import Team

class Match(models.Model):
    team1 = models.ForeignKey(Team, related_name='home_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(Team, related_name='away_matches', on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    #consent_requests = models.ManyToManyField(ConsentRequest)

