#!/usr/bin/env python3
"""Validate a stable release and synchronize application and Swagger versions."""

import argparse
import json
import os
from pathlib import Path
import re
import subprocess


VERSION = re.compile(r"v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)")


def normalize(value):
    match = VERSION.fullmatch(value)
    if not match:
        raise ValueError("Version must be x.y.z or vx.y.z (no leading zeros or suffixes)")
    return "v" + ".".join(match.groups())


def validate(value, root=Path(".")):
    tag = normalize(value)
    version = tag[1:]
    tags = subprocess.check_output(["git", "tag", "--list"], cwd=root, text=True).splitlines()
    if tag in tags:
        raise ValueError(f"Tag {tag} already exists")
    releases = [tuple(map(int, VERSION.fullmatch(t).groups())) for t in tags
                if t.startswith("v") and VERSION.fullmatch(t)]
    if releases and tuple(map(int, version.split("."))) <= max(releases):
        raise ValueError("Version must be greater than all existing stable release tags")
    return tag


def prepare(value, root=Path(".")):
    tag = validate(value, root)
    version = tag[1:]

    # Prepare all replacements before writing, so unexpected file formats fail early.
    changes = {}
    replacements = {
        "pkg/version/version.go": (r'(?m)^const Version = "[^"]+"$', f'const Version = "{version}"'),
        "main.go": (r'(?m)^(// @version\s+)\S+$', rf'\g<1>{version}'),
        "docs/docs.go": (r'(?m)^(\s*Version:\s*)"[^"]+",$', rf'\g<1>"{version}",'),
        "docs/swagger.yaml": (r'(?m)^(  version: )[^\n]+$', rf'\g<1>"{version}"'),
    }
    for name, (pattern, replacement) in replacements.items():
        updated, count = re.subn(pattern, replacement, (root / name).read_text())
        if count != 1:
            raise ValueError(f"Expected exactly one version field in {name}, found {count}")
        changes[name] = updated
    for name, indent in [("web/package.json", 2), ("docs/swagger.json", 4)]:
        data = json.loads((root / name).read_text())
        target = data["info"] if name.startswith("docs/") else data
        target["version"] = version
        changes[name] = json.dumps(data, indent=indent, ensure_ascii=False) + "\n"
    for name, content in changes.items():
        (root / name).write_text(content)
    return tag


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("version")
    parser.add_argument("--validate-only", action="store_true",
                        help="Validate the tag without changing application files")
    args = parser.parse_args()
    try:
        tag = validate(args.version) if args.validate_only else prepare(args.version)
    except ValueError as error:
        parser.exit(1, f"{error}\n")
    if "GITHUB_OUTPUT" in os.environ:
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write(f"tag={tag}\n")
    print(tag)
