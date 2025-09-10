from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # Map camelCase → snake_case for React
    firstName = serializers.CharField(source="first_name", required=True)
    lastName = serializers.CharField(source="last_name", required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ["username", "firstName", "lastName", "email", "password", "confirm"]

    def validate(self, data):
        """ Ensure passwords match """
        if data["password"] != data["confirm"]:
            raise serializers.ValidationError({"confirm": "Passwords do not match"})
        return data

    def create(self, validated_data):
        """ Create a user safely using create_user() """
        validated_data.pop("confirm")  # remove confirm
        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    # Map camelCase → snake_case for frontend
    firstName = serializers.CharField(source="first_name", required=False)
    lastName = serializers.CharField(source="last_name", required=False)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "username", "firstName", "lastName", "email", "profile_image"]
        read_only_fields = ["id", "username", "email"]  # don’t allow updates to these

    def update(self, instance, validated_data):
        """Allow partial updates (e.g., profile update with image)"""
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)

        # handle profile image if provided
        if "profile_image" in validated_data:
            instance.profile_image = validated_data.get("profile_image", instance.profile_image)

        instance.save()
        return instance
