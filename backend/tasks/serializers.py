from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='first_name')

    class Meta:
        model = User
        fields = ('id', 'email', 'fullName')

class RegisterSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'fullName')

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized_email

    def create(self, validated_data):
        fullName = validated_data.pop('fullName')
        email = validated_data['email']
        # Use email as username for authentication
        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=fullName,
        )
        return user

class TaskSerializer(serializers.ModelSerializer):
    dueDate = serializers.DateField(source='due_date')
    assignedTo = serializers.CharField(source='assigned_to')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'priority', 'dueDate', 'assignedTo', 'status', 'createdAt')
        read_only_fields = ('id', 'createdAt')
