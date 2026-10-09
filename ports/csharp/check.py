import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = ROOT / 'ports/csharp'
coverage = {}
for source in sorted((ROOT / 'src').rglob('*.ts')):
    target = PORT / source.relative_to(ROOT / 'src').with_suffix('.cs')
    if not target.is_file():
        raise FileNotFoundError(target)
    text = target.read_text(encoding='utf-8')
    names = re.findall(r'^export\s+(?:abstract\s+)?(?:const|function\s*\*?|class)\s+(\w+)', source.read_text(encoding='utf-8'), re.M)
    exports = {}
    for name in names:
        native = name[0].upper() + name[1:]
        if not re.search(r'\b' + re.escape(native) + r'\b', text):
            raise ValueError(f'Missing export {source}:{native}')
        exports[name] = native
    coverage[source.relative_to(ROOT).as_posix()] = {'path': target.relative_to(ROOT).as_posix(), 'exports': exports}
(PORT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8')
subprocess.run(['dotnet', 'run', '--project', str(PORT / 'tests/Checks.csproj'), '--', str(ROOT / 'ports/golden-cases.json')], check=True)
