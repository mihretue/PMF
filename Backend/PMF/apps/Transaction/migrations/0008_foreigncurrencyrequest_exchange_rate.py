# Generated by Django 5.1.7 on 2025-06-14 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0007_foreigncurrencyrequest_escrow_moneytransfer_escrow_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='foreigncurrencyrequest',
            name='exchange_rate',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=12, null=True),
        ),
    ]
