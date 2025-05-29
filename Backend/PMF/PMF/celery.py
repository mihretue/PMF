import os
import django
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PMF.settings")

# Initialize Django before importing ORM models
django.setup()

app = Celery("PMF")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# app.conf.worker_pool = 'solo'



@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    from django_celery_beat.models import PeriodicTask, IntervalSchedule  # Import inside the function

    schedule, _ = IntervalSchedule.objects.get_or_create(
        every=15,  # Every 15 minutes
        period=IntervalSchedule.MINUTES,
    )

    PeriodicTask.objects.update_or_create(
        name="Update Exchange Rates",
        defaults={"interval": schedule, "task": "your_app.tasks.update_exchange_rates_task"},
    )
