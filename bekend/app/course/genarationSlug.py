from unidecode import unidecode
from django.utils.text import slugify


def genarationSlug(string):
    return slugify(unidecode(string))