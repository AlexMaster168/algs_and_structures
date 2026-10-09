import json
import os
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = ROOT / 'ports/cpp'
coverage = {}
for source in sorted((ROOT / 'src').rglob('*.ts')):
    target = PORT / source.relative_to(ROOT / 'src').with_suffix('.hpp')
    text = target.read_text(encoding='utf-8')
    names = re.findall(r'^export\s+(?:abstract\s+)?(?:const|function\s*\*?|class)\s+(\w+)', source.read_text(encoding='utf-8'), re.M)
    exports = {}
    for name in names:
        if not re.search(r'\b' + re.escape(name) + r'\b', text):
            raise ValueError(f'Missing export {source}:{name}')
        exports[name] = name
    coverage[source.relative_to(ROOT).as_posix()] = {'path': target.relative_to(ROOT).as_posix(), 'exports': exports}
(PORT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8')
compiler = shutil.which('g++') or str(ROOT / 'dist/gcc-tools/mingw64/bin/g++.exe')
environment = os.environ.copy()
environment['PATH'] = str(pathlib.Path(compiler).parent) + os.pathsep + environment['PATH']
out = ROOT / 'dist/cpp-checks'
out.mkdir(parents=True, exist_ok=True)
headers = sorted(path for folder in ['algorithms', 'data-structures', 'patterns', 'shared'] for path in (PORT / folder).rglob('*.hpp'))
(PORT / 'tests/headers.cpp').write_text('\n'.join('#include "../' + path.relative_to(PORT).as_posix() + '"' for path in headers) + '\nint main() {}\n', encoding='utf-8')
subprocess.run([compiler, '-std=c++20', '-fsyntax-only', str(PORT / 'tests/headers.cpp')], env=environment, check=True)
for name in ['conformance', 'trees', 'patterns']:
    executable = out / (name + ('.exe' if os.name == 'nt' else ''))
    subprocess.run([compiler, '-std=c++20', '-O1', str(PORT / 'tests' / (name + '.cpp')), '-o', str(executable)], env=environment, check=True)
    command = [str(executable)]
    if name == 'conformance':
        command.append(str(ROOT / 'ports/golden-cases.json'))
    subprocess.run(command, env=environment, check=True)
