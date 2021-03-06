# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-28 11:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='sex',
            field=models.CharField(choices=[(b'm', b'Male'), (b'f', b'Female')], default=b'm', max_length=10),
        ),
        migrations.AddField(
            model_name='item',
            name='years',
            field=models.PositiveIntegerField(blank=True, help_text=b'Years living in the area', null=True),
        ),
    ]
