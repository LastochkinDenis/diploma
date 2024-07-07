from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField

class UserMeneger(BaseUserManager):

    def create_user(self, email, password, firstName, lastName):
        if email is None and email == '':
            raise ValueError('User must have email')
        if password is None and password == '':
            raise ValueError('User must have password')
        if firstName is None and firstName == '':
            raise ValueError('User must have first name')
        if lastName is None and lastName == '':
            raise ValueError('User must have last name')
        
        user = self.model(email=email, firstName=firstName, lastName=lastName)
        user.set_password(password)
        user.save()
        
        return user

    def create_superuser(self, email, password, firstName, lastName):
        user = self.create_user(email, password, firstName, lastName)

        user.is_staff = True
        user.is_superuser = True

        user.save()
        
        return user

class User(AbstractBaseUser, PermissionsMixin):
    
    email = models.EmailField(db_index=True, unique=True)
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    biography = models.TextField(default="")
    aboutMe = models.TextField(default="")
    private = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    profile_picture = models.ImageField(upload_to='profile_picture_users/')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserMeneger()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def get_full_name(self):
        return '%s %s' % (self.firstName, self.lastName)
    
    def get_short_name(self):
        return self.firstName

class UserSocialMedia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    link = ArrayField(base_field=models.CharField(max_length=255))

    class Meta:
        verbose_name = 'user social media'
        verbose_name_plural = 'users social media'