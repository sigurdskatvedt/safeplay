from django.db import models

from django.db import models
from apps.teams.models import Team
from apps.consent_requests.models import ConsentRequest

class Match(models.Model):
    team1 = models.ForeignKey(Team, related_name='home_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(Team, related_name='away_matches', on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    #consent_requests = models.ManyToManyField(ConsentRequest)

    def save(self, *args, **kwargs):
        is_new = not self.pk  # Check if this is a new match
        super().save(*args, **kwargs)  # Call the original save method

        if is_new:
            # For each user in team1 and team2, create a consent request
            for team in [self.team1, self.team2]:
                for user in team.members.all():
                    ConsentRequest.objects.create(user=user, match=self)
