from django.shortcuts import render
from userauth.models import User, Profile
from userauth.serializer import MyTokenobtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import shortuuid 

class MyTokenObtainParirView(TokenObtainPairView):
    serializer_class = MyTokenobtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() 
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer   

def generate_otp():
    uuid_key = shortuuid.uuid()
    unique_key = uuid_key[:6]
    return unique_key    

class PasswordResatEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email'] 
        user = User.objects.get(email=email)
        if user:
                user.otp = generate_otp()
                user.save()

                uidb64 = user.pk
                otp = user.otp

                link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"
                print ("link ===", link) 
        return user
    
class PasswordChangeView(generics.CreateAPIView):
         
         permission_classes = (AllowAny,)
         serializer_class = UserSerializer

         def create(self, request):
              
              playlode = request.data

              otp = playlode['otp']
              uidb64 = playlode['uidb64']
              password = playlode['password']

              user = User.objects.get(otp=otp, id=uidb64)

              if user:
                   user.set_password(password)
                   user.otp = ""
                   user.save()
                   return Response({"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
              else:
                   print("amir")
                   return Response({"message": "Password Changed Successfully"}, status=status.HTTP_404_NOT_FOUND)
              
class ProfileView(generics.RetrieveUpdateAPIView):
     serializer_class = ProfileSerializer
     permission_classes = [AllowAny,]

     def get_object(self):
          user_id = self.kwargs['user_id']
          user = User.objects.get(id=user_id)
          profile = Profile.objects.get(user=user)
          return profile

# Create your views here.
