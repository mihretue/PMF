from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(read_only=True)  # Role is assigned automatically

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number', 'address', 'role']

    def create(self, validated_data):
        phone_number = validated_data['phone_number']

        # Assign role based on phone number
        if phone_number.startswith("+251"):  # Ethiopian numbers
            validated_data['role'] = 'receiver'
        else:
            validated_data['role'] = 'sender'

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=phone_number,
            address=validated_data.get('address', ''),
            role=validated_data['role']  # Assign role
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'role','profile_picture']
    
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None
