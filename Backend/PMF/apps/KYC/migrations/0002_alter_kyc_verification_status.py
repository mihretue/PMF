# Generated by Django 5.1.7 on 2025-06-12 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KYC', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kyc',
            name='verification_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20),
        ),
    ]
