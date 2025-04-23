from rest_framework import serializers
from .models import Player, Document


class PlayerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Player model.
    Includes all fields and a read-only 'balance' field.
    """
    balance = serializers.ReadOnlyField()  # Read-only field for the player's balance

    class Meta:
        """
        Meta class to define the model and fields to include in the serializer.
        """
        model = Player
        fields = '__all__'  # Include all fields from the Player model


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Document model.
    Includes custom validation for the 'file' field.
    """
    document_type = serializers.ChoiceField(choices=Document.DOCUMENT_TYPES)  # Restrict to valid document types
    file = serializers.FileField()  # File field for uploading documents

    class Meta:
        """
        Meta class to define the model, fields, and read-only fields.
        """
        model = Document
        fields = '__all__'  # Include all fields from the Document model
        read_only_fields = ('upload_date', )  # Make 'upload_date' read-only

    def validate_file(self, value):
        """
        Custom validation for the 'file' field.
        Ensures the file size does not exceed 10MB and restricts file types.
        """
        max_size = 10 * 1024 * 1024  # Maximum file size: 10MB
        if value.size > max_size:
            raise serializers.ValidationError("File size cannot exceed 10MB.")

        # Restrict file types to specific extensions
        allowed_extensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
        extension = value.name.split('.')[-1].lower()  # Extract file extension
        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Invalid file type. Allowed types are: pdf, doc, docx, jpg, jpeg, png"
            )
        return value