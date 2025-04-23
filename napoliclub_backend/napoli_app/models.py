from django.db import models


class Player(models.Model):
    """
    Represents a player in the Napoli Club system.
    Tracks personal details, performance metrics, and financial information.
    """

    AGE_GROUP_CHOICES = [
        ('U12', 'Under 12'),
        ('U14', 'Under 14'),
        ('U17', 'Under 17'),
        ('SENIOR', 'Senior'),
    ]

    first_name = models.CharField(max_length=100)  # Player's first name
    last_name = models.CharField(max_length=100)  # Player's last name
    nationality = models.CharField(max_length=100)  # Player's nationality
    id_number = models.CharField(
        max_length=13, unique=True
    )  # Unique ID number (e.g., national ID)
    gender = models.CharField(
        max_length=50, blank=True, null=True, verbose_name='Gender'
    )  # Gender of the player
    school = models.CharField(max_length=100)  # School the player attends
    previous_club = models.CharField(max_length=100)  # Previous club
    years_of_training = models.IntegerField(default=0)  # Years of training
    age_group = models.CharField(
        max_length=10, choices=AGE_GROUP_CHOICES, default='U12'
    )  # Age group category
    notes = models.TextField(blank=True)  # Additional notes

    position = models.CharField(max_length=50, blank=True)  # Player's position
    goals = models.IntegerField(default=0)  # Number of goals scored
    assists = models.IntegerField(default=0)  # Number of assists made

    mother_name = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Mother's Name"
    )  # Mother's name
    mother_phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Mother's Phone"
    )  # Mother's phone number
    mother_email = models.EmailField(
        blank=True, null=True, verbose_name="Mother's Email"
    )  # Mother's email address

    father_name = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Father's Name"
    )  # Father's name
    father_phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Father's Phone"
    )  # Father's phone number
    father_email = models.EmailField(
        blank=True, null=True, verbose_name="Father's Email"
    )  # Father's email address

    amount_owed = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )  # Total amount owed
    amount_paid = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )  # Total amount paid

    @property
    def balance(self):
        """
        Calculates the remaining balance (amount owed - amount paid).
        """
        return self.amount_owed - self.amount_paid

    class Meta:
        app_label = 'napoli_app'

    def __str__(self):
        """
        Returns a string representation of the player 
        (first name and last name).
        """
        return f"{self.first_name} {self.last_name}"


class Document(models.Model):
    """
    Represents a document associated with a player, 
    such as a passport or birth certificate.
    """

    DOCUMENT_TYPES = [
        ('passport', 'Passport'),
        ('birth_certificate', 'Birth Certificate'),
        ('other', 'Other'),
    ]

    player = models.ForeignKey(
        'Player', on_delete=models.CASCADE, related_name='documents'
    )  # Associated player
    document_type = models.CharField(
        max_length=50, choices=DOCUMENT_TYPES
    )  # Type of document
    file = models.FileField(upload_to='documents/') # File path for the document
    description = models.CharField(
        max_length=255, blank=True, null=True
    )  # Optional description
    upload_date = models.DateTimeField(auto_now_add=True)  # Upload timestamp

    def __str__(self):
        """
        Returns a string representation of the document (type and description).
        """
        return f"{self.document_type} - {self.description}"