import argparse
import json
import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('languages', nargs='*')
    args = parser.parse_args()
    registry = json.loads((ROOT / 'ports' / 'checks.json').read_text(encoding='utf-8'))
    languages = args.languages or list(registry)
    environment = os.environ.copy()
    environment['PYTHONDONTWRITEBYTECODE'] = '1'
    environment['CARGO_TARGET_DIR'] = str(ROOT / 'dist' / 'rust-target')
    for language in languages:
        if language not in registry:
            raise ValueError(f'Unknown language: {language}')
        settings = registry[language]
        for command in settings['commands']:
            command = [sys.executable if arg == '{python}' else arg for arg in command]
            subprocess.run(command, cwd=ROOT / settings['cwd'], env=environment, check=True)
        print(f'PASS {language}', flush=True)


if __name__ == '__main__':
    main()
