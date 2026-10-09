import json
import os
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = ROOT / 'ports/go'
normalize = lambda name: re.sub('[^a-z0-9]', '', name.lower())
coverage = {}
for source in sorted((ROOT / 'src').rglob('*.ts')):
    target = PORT / source.relative_to(ROOT / 'src').with_suffix('.go')
    text = target.read_text(encoding='utf-8')
    functions = re.findall(r'^func\s+(\w+)', text, re.M)
    types = re.findall(r'^type\s+(\w+)', text, re.M)
    exported = re.findall(r'^export\s+(?:abstract\s+)?(const|function\s*\*?|class)\s+(\w+)', source.read_text(encoding='utf-8'), re.M)
    exports = {}
    for kind, name in exported:
        candidates = types if kind == 'class' else functions
        native = next((value for value in candidates if normalize(value) == normalize(name)), None)
        if native is None:
            native = next((value for value in candidates if normalize(value) == 'new' + normalize(name)), None)
        if native is None:
            raise ValueError(f'Missing export {source}:{name}')
        exports[name] = native
    coverage[source.relative_to(ROOT).as_posix()] = {'path': target.relative_to(ROOT).as_posix(), 'exports': exports}
(PORT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8')
compiler = shutil.which('go')
if not compiler:
    local = ROOT / 'dist/go-port-tools/go/bin/go.exe'
    if local.exists():
        compiler = str(local)
if not compiler:
    raise FileNotFoundError('Go compiler not found')
environment = os.environ.copy()
environment['GOCACHE'] = str(ROOT / 'dist/go-port-cache')
environment['GOTOOLCHAIN'] = 'local'
subprocess.run([compiler, 'test', './...'], cwd=PORT, env=environment, check=True)
