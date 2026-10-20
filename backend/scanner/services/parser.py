import re


class RequirementsParserService:
    PACKAGE_NAME_REGEX = re.compile(
        r"^([A-Z0-9]|[A-Z0-9][A-Z0-9._-]*[A-Z0-9])$", re.IGNORECASE
    )

    @classmethod
    def parse(cls, file_obj):
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
                name = name.strip()
                version = version.strip()
            else:
                name = decoded_line
                version = "latest"

            if not cls.PACKAGE_NAME_REGEX.match(name):
                continue

            packages.append(
                {
                    "name": name,
                    "version": version,
                    "raw": decoded_line,
                }
            )

        return packages
