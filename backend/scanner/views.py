from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .services import RequirementsParserService

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file_view(request):
    if 'file' not in request.FILES:
        return Response({"error": "Aucun fichier n'a été fourni."}, status=status.HTTP_400_BAD_REQUEST)

    file_obj = request.FILES['file']

    if not file_obj.name.endswith('.txt'):
        return Response({"error": "Le fichier doit être un fichier texte (.txt)."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        parsed_packages = RequirementsParserService.parse(file_obj)

        return Response({
            "filename": file_obj.name,
            "count": len(parsed_packages),
            "packages": parsed_packages
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Erreur lors du traitement du fichier : {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)