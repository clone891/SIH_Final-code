from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView 
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Handles user registration.
    Saves user directly into the configured database (MySQL if set in settings.py).
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class MeView(APIView):
    """
    Returns details of the currently authenticated user.
    Useful for profile pages.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)




# You can use this directly in urls.py
login_view = TokenObtainPairView.as_view()
