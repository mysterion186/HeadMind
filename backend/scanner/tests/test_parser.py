import io
from django.test import TestCase
from scanner.services.parser import RequirementsParserService


class RequirementsParserServiceTest(TestCase):
    def test_parse_standard_requirements(self):
        """Teste l'analyse d'un fichier requirements standard avec différentes versions et opérateurs."""
        content = b"""
        # Fichier de test requirements
        Django==6.1.2
        requests>=2.34.2
        sqlparse~=0.6.0
        
        # Package sans version explicite
        pytest
        """

        file_obj = io.BytesIO(content.strip())
        packages = RequirementsParserService.parse(file_obj)

        self.assertEqual(len(packages), 4)
        self.assertEqual(
            packages[0], {"name": "Django", "version": "6.1.2", "raw": "Django==6.1.2"}
        )
        self.assertEqual(
            packages[1],
            {"name": "requests", "version": "2.34.2", "raw": "requests>=2.34.2"},
        )
        self.assertEqual(
            packages[2],
            {"name": "sqlparse", "version": "0.6.0", "raw": "sqlparse~=0.6.0"},
        )
        self.assertEqual(
            packages[3], {"name": "pytest", "version": "latest", "raw": "pytest"}
        )

    def test_parse_empty_file(self):
        """Edge case : Fichier vide ou espaces."""
        content = b"   \n\n   "
        file_obj = io.BytesIO(content)
        packages = RequirementsParserService.parse(file_obj)
        self.assertEqual(packages, [])

    def test_parse_with_inline_comments(self):
        """Edge case : Commentaires en fin de ligne."""
        content = b"requests==2.34.2 # Security fix"
        file_obj = io.BytesIO(content)
        packages = RequirementsParserService.parse(file_obj)
        self.assertEqual(packages[0]["name"], "requests")
        self.assertEqual(packages[0]["version"], "2.34.2")

    def test_parse_pip_flags_and_editable(self):
        """Teste le comportement avec des commandes pip avancées (-r, --hash, -e)."""
        content = b"""
        -r other-requirements.txt
        --hash=sha256:abcdef123456
        -e .
        """
        file_obj = io.BytesIO(content.strip())
        packages = RequirementsParserService.parse(file_obj)

        # Le parseur actuel les traite comme des packages "latest" faute de correspondance regex
        self.assertEqual(len(packages), 3)
        self.assertEqual(packages[0]["version"], "latest")
