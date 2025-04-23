from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Player, Document
from .serializers import PlayerSerializer, DocumentSerializer
from django.shortcuts import get_object_or_404
import logging

# Set up logging for debugging purposes
logger = logging.getLogger(__name__)


@api_view(['GET'])
def api_root(request):
    """
    Root API endpoint.
    Returns a welcome message.
    """
    return Response({"message": "Welcome to the API root"})

@api_view(['GET', 'POST'])
def manage_data(request):
    """
    Handles GET and POST requests for managing player data.
    - GET: Returns a list of all players.
    - POST: Creates a new player.
    """
    if request.method == 'GET':
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def login(request):
    """
    Handles user login.
    Authenticates the user and returns a token along with user details.
    """
    logger.debug(f"Received data: {request.data}")  # Log the incoming data
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)

        role = 'manager' if user.is_staff else 'player'
        
        return Response({
            'token': token.key,
            'role': role,  
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])  # Only managers/admins can register users
def register_player_as_user(request, player_id):
    """
    Registers a player as a user in the system.
    - Only accessible by admins.
    """
    try:
        # Fetch the player by ID
        player = Player.objects.get(id=player_id)

        # Check if a user already exists with the player's ID number as username
        if User.objects.filter(username=player.id_number).exists():
            return Response({'error': 'User already exists for this player.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Create a new user
        user = User.objects.create_user(
            username=player.id_number,
            first_name=player.first_name,
            last_name=player.last_name,
            password='napoliNSC'  # Default password
        )
        user.save()

        return Response({'message': 'User registered successfully.'}, 
                        status=status.HTTP_201_CREATED)
    except Player.DoesNotExist:
        return Response({'error': 'Player not found.'}, 
                        status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlayerListCreateView(generics.ListCreateAPIView):
    """
    View for listing all players and creating a new player.
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def get_queryset(self):
        id_number = self.request.query_params.get('id_number')
        if id_number:
            return Player.objects.filter(id_number=id_number)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        """
        Override the create method to handle errors and return a custom response.
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers)
    
    
class PlayerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for retrieving, updating, and deleting a single player.
    """

    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class DocumentCreateView(generics.CreateAPIView):
    """
    View for creating (uploading) a new document.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)  # Ensure file uploads are parsed
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Log incoming data for debugging
        print("Request Data:", request.data)
        print("Request Files:", request.FILES)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Associate the document with a player
            player_id = request.data.get('player')
            player = get_object_or_404(Player, id=player_id)
            serializer.save(player=player)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)  # Log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentListView(generics.ListAPIView):
    """
    View for listing documents, optionally filtered by player.
    """

    serializer_class = DocumentSerializer
    filterset_fields = ['player']

    def get_queryset(self):
        """
        Override get_queryset to filter documents by player if provided.
        """

        player_id = self.request.query_params.get('player')
        if player_id:
            get_object_or_404(Player, pk=player_id)
            return Document.objects.filter(player_id=player_id)
        return Document.objects.all()
    
class DocumentRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    """
    View for retrieving and deleting a single document.
    """

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)
