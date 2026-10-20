import io
from unittest.mock import patch
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile


class UploadFileViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_upload_no_file(self):
        """Teste l'appel de l'API sans fournir de fichier."""
        response = self.client.post("/api/upload/")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Aucun fichier fourni."})

    @patch("scanner.views.OsvVulnerabilityService.check_package")
    def test_upload_success(self, mock_check_package):
        """Teste l'upload d'un fichier valide avec un mock sur l'appel OSV."""
        # On simule le résultat de l'analyse de vulnérabilité pour chaque package
        mock_check_package.return_value = {
            "vulnerable": False,
            "error": False,
            "error_message": "",
            "vulns": [],
        }

        file_content = b"Django==6.1.2\nrequests==2.34.2"
        uploaded_file = SimpleUploadedFile(
            "requirements.txt", file_content, content_type="text/plain"
        )

        response = self.client.post("/api/upload/", {"file": uploaded_file})

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["filename"], "requirements.txt")
        self.assertEqual(data["count"], 2)
        self.assertEqual(len(data["packages"]), 2)
        self.assertEqual(data["packages"][0]["name"], "Django")

    def test_upload_invalid_file_extension(self):
        """Teste l'upload d'un fichier qui n'a pas l'extension .txt."""
        file_content = b"Contenu quelconque"
        uploaded_file = SimpleUploadedFile(
            "malicious.pdf", file_content, content_type="application/pdf"
        )

        response = self.client.post("/api/upload/", {"file": uploaded_file})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {"error": "Format de fichier invalide. Veuillez fournir un fichier .txt."},
        )
