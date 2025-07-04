# Generated by Django 5.1.7 on 2025-06-12 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Escrow', '0002_remove_escrow_transaction_escrow_content_type_and_more'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='escrow',
            name='currency',
            field=models.CharField(default='USD', max_length=10),
        ),
        migrations.AlterField(
            model_name='escrow',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('funds_held', 'Funds Held'), ('released', 'Released'), ('refunded', 'Refunded'), ('disputed', 'Disputed')], default='pending', max_length=20),
        ),
        migrations.AddConstraint(
            model_name='escrow',
            constraint=models.CheckConstraint(condition=models.Q(('amount__gt', 0)), name='positive_amount'),
        ),
    ]
