# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-25 18:31
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0005_auto_20160225_1822'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='year',
        ),
    ]