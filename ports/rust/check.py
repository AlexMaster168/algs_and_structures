import json
import os
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = ROOT / 'ports/rust'
coverage = {}
for source in sorted((ROOT / 'src').rglob('*.ts')):
    relative = source.relative_to(ROOT / 'src').with_suffix('.rs').as_posix().replace('-', '_')
    target = PORT / relative
    text = target.read_text(encoding='utf-8')
    declarations = re.findall(r'^export\s+(?:abstract\s+)?(const|function\s*\*?|class)\s+(\w+)', source.read_text(encoding='utf-8'), re.M)
    exports = {}
    for kind, name in declarations:
        native = name if kind == 'class' else re.sub(r'(?<!^)(?=[A-Z])', '_', name).lower()
        if not re.search(r'\b' + re.escape(native) + r'\b', text):
            raise ValueError(f'Missing export {source}:{native}')
        exports[name] = native
    coverage[source.relative_to(ROOT).as_posix()] = {'path': target.relative_to(ROOT).as_posix(), 'exports': exports}
(PORT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8', newline='\n')
compiler = shutil.which('cargo')
environment = os.environ.copy()
if compiler is None:
    compiler = str(ROOT / 'dist/rust-tools/bin/cargo.exe')
    environment['CARGO_HOME'] = str(ROOT / 'dist/cargo-home')
    environment['PATH'] = str(ROOT / 'dist/rust-tools/bin') + os.pathsep + str(ROOT / 'dist/gcc-tools/mingw64/bin') + os.pathsep + environment['PATH']
environment['CARGO_TARGET_DIR'] = str(ROOT / 'dist/rust-target')
subprocess.run([compiler, 'test', '--manifest-path', str(PORT / 'Cargo.toml'), '--locked'], env=environment, check=True)
