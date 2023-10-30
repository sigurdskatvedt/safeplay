# backend/apps/matches/models.py

from django.db import models
from apps.teams.models import Team
from apps.consent_requests.models import ConsentRequest

class Match(models.Model):
    team1 = models.ForeignKey(
        Team, related_name='home_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(
        Team, related_name='away_matches', on_delete=models.CASCADE)
    date_time = models.DateTimeField()

    def save(self, *args, **kwargs):
        is_new = not self.pk  # Check if this is a new match
        super().save(*args, **kwargs)

        if is_new:
            for team in [self.team1, self.team2]:
                for user in team.members.all():
                    ConsentRequest.objects.create(user=user, match=self)

