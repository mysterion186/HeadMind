import requests
from unittest.mock import patch
from django.test import TestCase
from scanner.services.osv import OsvVulnerabilityService


class OsvVulnerabilityServiceTest(TestCase):
    @patch("scanner.services.osv.requests.post")
    def test_check_package_vulnerable(self, mock_post):
        """Teste le service OSV lorsqu'une vulnérabilité est trouvée."""
        # Simulation d'une réponse de l'API OSV
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "vulns": [
                {
                    "id": "CVE-2020-14343",
                    "summary": "PyYAML RCE",
                    "details": "Arbitrary code execution vulnerability",
                    "database_specific": {"severity": "CRITICAL"},
                }
            ]
        }

        result = OsvVulnerabilityService.check_package("PyYAML", "5.3.1")

        self.assertTrue(result["vulnerable"])
        self.assertFalse(result["error"])
        self.assertEqual(len(result["vulns"]), 1)
        self.assertEqual(result["vulns"][0]["id"], "CVE-2020-14343")
        self.assertEqual(result["vulns"][0]["severity"], "CRITICAL")

    @patch("scanner.services.osv.requests.post")
    def test_check_package_no_version(self, mock_post):
        """Teste le service OSV lorsque la version n'est pas spécifiée (latest)."""
        result = OsvVulnerabilityService.check_package("pytest", "latest")

        self.assertFalse(result["vulnerable"])
        self.assertTrue(result["error"])
        mock_post.assert_not_called()

    @patch("scanner.services.osv.requests.post")
    def test_check_package_api_error(self, mock_post):
        """Teste le comportement en cas d'erreur HTTP de l'API distante (ex: 500)."""
        mock_post.return_value.status_code = 500

        result = OsvVulnerabilityService.check_package("Django", "6.1.2")

        self.assertFalse(result["vulnerable"])
        self.assertTrue(result["error"])
        self.assertEqual(result["error_message"], "Erreur API distante (code 500)")

    @patch("scanner.services.osv.requests.post")
    def test_check_package_timeout_or_network_error(self, mock_post):
        """Teste la gestion des erreurs réseau / timeout de l'API OSV."""
        # Simule une exception de type RequestException (timeout, échec DNS, etc.)
        mock_post.side_effect = requests.RequestException("Timeout de connexion")

        result = OsvVulnerabilityService.check_package("requests", "2.34.2")

        self.assertFalse(result["vulnerable"])
        self.assertTrue(result["error"])
        self.assertEqual(result["error_message"], "Échec de connexion à l'API OSV")
