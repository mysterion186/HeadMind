import requests


class OsvVulnerabilityService:
    API_URL = "https://api.osv.dev/v1/query"

    @classmethod
    def check_package(cls, name: str, version: str):
        """
        Interroge l'API OSV.dev.
        """
        if not version or version == "latest":
            return {
                "vulnerable": False,
                "error": True,
                "error_message": "Version non spécifiée, impossible de vérifier",
                "vulns": []
            }

        payload = {
            "version": version,
            "package": {
                "name": name,
                "ecosystem": "PyPI"
            }
        }

        try:
            response = requests.post(cls.API_URL, json=payload, timeout=5)
            if response.status_code == 200:
                data = response.json()
                vulns = data.get("vulns", [])
                return {
                    "vulnerable": len(vulns) > 0,
                    "error": False,
                    "error_message": "",
                    "vulns": [
                        {
                            "id": v.get("id"),
                            "summary": v.get("summary", "Pas de résumé disponible"),
                            "details": v.get("details", "")[:200] + "..." if v.get("details") else ""
                        }
                        for v in vulns
                    ]
                }
            else:
                return {
                    "vulnerable": False,
                    "error": True,
                    "error_message": f"Erreur API distante (code {response.status_code})",
                    "vulns": []
                }

        except requests.RequestException:
            return {
                "vulnerable": False,
                "error": True,
                "error_message": "Échec de connexion à l'API OSV",
                "vulns": []
            }