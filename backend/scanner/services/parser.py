import re


class RequirementsParserService:
    @staticmethod
    def parse(file_obj):
        """
        Lit un fichier requirements.txt et extrait les packages et leurs versions.
        """
        packages = []

        for line in file_obj:
            decoded_line = line.decode("utf-8").strip()

            if not decoded_line or decoded_line.startswith("#"):
                continue

            if "#" in decoded_line:
                decoded_line = decoded_line.split("#")[0].strip()

            match = re.match(r"^([a-zA-Z0-9_.-]+)\s*([=<>!~]+)\s*(.+)$", decoded_line)

            if match:
                name, operator, version = match.groups()
                packages.append(
                    {
                        "name": name.strip(),
                        "version": version.strip(),
                        "raw": decoded_line,
                    }
                )
            else:
                packages.append(
                    {"name": decoded_line, "version": "latest", "raw": decoded_line}
                )

        return packages

