import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("prepare_release", ROOT / "scripts/prepare-release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ["pkg/version/version.go", "main.go", "docs/docs.go",
                     "docs/swagger.yaml", "docs/swagger.json", "web/package.json"]:
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        self.git("init", "-q")
        self.git("add", ".")
        self.git("-c", "user.name=Test", "-c", "user.email=test@example.com",
                 "commit", "-qm", "feat: initial release")

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root, text=True)

    def test_normalization(self):
        for value in ["0.0.0", "1.2.3", "10.20.300"]:
            self.assertEqual(release.normalize(value), "v" + value)
            self.assertEqual(release.normalize("v" + value), "v" + value)

    def test_invalid_versions(self):
        for value in ["", "1.2", "v01.2.3", "1.02.3", "1.2.03", "V1.2.3",
                      "v1.2.3-rc.1", "1.2.3+build", " 1.2.3", "1.2.3\n", "$(id)"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                release.normalize(value)

    def test_synchronizes_all_versions(self):
        self.assertEqual(release.prepare("1.2.3", self.root), "v1.2.3")
        self.assertIn('const Version = "1.2.3"', (self.root / "pkg/version/version.go").read_text())
        self.assertRegex((self.root / "main.go").read_text(), r"// @version\s+1\.2\.3")
        self.assertRegex((self.root / "docs/docs.go").read_text(), r'Version:\s+"1.2.3"')
        self.assertIn('  version: "1.2.3"', (self.root / "docs/swagger.yaml").read_text())
        self.assertEqual(json.loads((self.root / "docs/swagger.json").read_text())["info"]["version"], "1.2.3")
        self.assertEqual(json.loads((self.root / "web/package.json").read_text())["version"], "1.2.3")

    def test_validate_only_does_not_change_files(self):
        result = subprocess.check_output(
            ["python3", str(ROOT / "scripts/prepare-release.py"), "--validate-only", "1.2.3"],
            cwd=self.root, text=True,
        )
        self.assertEqual(result.strip(), "v1.2.3")
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_validate_rejects_existing_and_older_tags(self):
        self.git("tag", "v1.10.0")
        for value in ["1.10.0", "1.9.0"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                release.validate(value, self.root)
        self.assertEqual(release.validate("1.11.0", self.root), "v1.11.0")
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_existing_and_older_versions_fail_without_changes(self):
        self.git("tag", "v1.10.0")
        for value in ["1.10.0", "1.9.0"]:
            with self.assertRaises(ValueError):
                release.prepare(value, self.root)
            self.assertEqual(self.git("diff"), "")
        self.assertEqual(release.prepare("1.11.0", self.root), "v1.11.0")

    def test_unexpected_format_fails_before_writing(self):
        (self.root / "docs/swagger.yaml").write_text("info: {}\n")
        before = self.git("diff")
        with self.assertRaises(ValueError):
            release.prepare("1.2.3", self.root)
        self.assertEqual(self.git("diff"), before)


if __name__ == "__main__":
    unittest.main()
