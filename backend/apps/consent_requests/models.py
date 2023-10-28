from django.db import models
from apps.users.models import User

class ConsentRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consent_requests')
    match = models.ForeignKey(
        'matches.Match',  # Use the app_name.ModelName string format to avoid circular imports
        on_delete=models.CASCADE,
        related_name='consent_requests'
    )
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'match']

    def __str__(self):
        return f"Consent Request for {self.user.username} for Match {self.match.id}"


