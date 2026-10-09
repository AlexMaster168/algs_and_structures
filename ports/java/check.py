import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent.parent
OUTPUT = REPO / 'dist' / 'java-classes'
OUTPUT.mkdir(parents=True, exist_ok=True)
files = list((ROOT / 'src').rglob('*.java')) + list((ROOT / 'tests').rglob('*.java'))
modules = {}
normalize = lambda text: re.sub(r'[^a-z0-9/]', '', text.lower())
targets = {normalize(p.relative_to(ROOT / 'src').with_suffix('').as_posix()): p for p in (ROOT / 'src').rglob('*.java')}
for source in (REPO / 'src').rglob('*.ts'):
    path = targets[normalize(source.relative_to(REPO / 'src').with_suffix('').as_posix())]
    package = re.search(r'package ([\w.]+);', path.read_text(encoding='utf-8')).group(1)
    modules[source.relative_to(REPO).as_posix()] = package + '.' + path.stem
module_file = OUTPUT / 'modules.json'
module_file.write_text(json.dumps(modules), encoding='utf-8')
subprocess.run(['javac', '-d', str(OUTPUT), *map(str, files)], check=True)
subprocess.run(['java', '-cp', str(OUTPUT), 'Conformance', str(REPO / 'ports' / 'golden-cases.json'), str(module_file)], check=True)
