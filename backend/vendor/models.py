from django.db import models
from userauth.models import User
from django.utils.text import slugify

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="vendor", blank=True, null=True)
    name = models.CharField(max_length=100,  null=True, blank=True)
    email = models.EmailField(max_length=100,  null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    mobile = models.CharField(max_length=100,  null=True, blank=True)
    phone = models.CharField(max_length=14, blank=True, null=True)
    active = models.BooleanField(default=True)
    date = models.DateField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=500)

    class Meta:
        verbose_name_plural = "Vendors"
        ordering = ['-date']
    def __str__(self):
        return str(self.name) 
    def save(self, *args, **kwargs):
        if self.slug == ""  or self.slug == None: 
            self.slug = slugify(self.name)
        super(Vendor, self).save(*args, **kwargs)    




# Create your models here.
