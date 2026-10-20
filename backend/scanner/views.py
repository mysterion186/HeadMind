from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from scanner.services.parser import RequirementsParserService
from scanner.services.osv import OsvVulnerabilityService


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_file_view(request):
    if "file" not in request.FILES:
        return Response(
            {"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST
        )

    file_obj = request.FILES["file"]

    if not file_obj.name.endswith(".txt"):
        return Response(
            {"error": "Format de fichier invalide. Veuillez fournir un fichier .txt."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        parsed_packages = RequirementsParserService.parse(file_obj)

        analyzed_packages = []
        for pkg in parsed_packages:
            vuln_data = OsvVulnerabilityService.check_package(
                pkg["name"], pkg["version"]
            )
            analyzed_packages.append({**pkg, **vuln_data})

        return Response(
            {
                "filename": file_obj.name,
                "count": len(analyzed_packages),
                "packages": analyzed_packages,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

