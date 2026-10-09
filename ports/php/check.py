import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PORT = ROOT / 'ports/php'
coverage = {}
for source in sorted((ROOT / 'src').rglob('*.ts')):
    target = PORT / source.relative_to(ROOT / 'src').with_suffix('.php')
    text = target.read_text(encoding='utf-8')
    namespace = re.search(r'namespace\s+([^;]+);', text).group(1)
    names = re.findall(r'^export\s+(?:abstract\s+)?(?:const|function\s*\*?|class)\s+(\w+)', source.read_text(encoding='utf-8'), re.M)
    coverage[source.relative_to(ROOT).as_posix()] = {'path': target.relative_to(ROOT).as_posix(), 'exports': {name: namespace + '\\' + name for name in names}}
(PORT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n', encoding='utf-8')
for target in sorted(PORT.rglob('*.php')):
    subprocess.run(['php', '-l', str(target)], check=True, stdout=subprocess.DEVNULL)
subprocess.run(['php', str(PORT / 'tests/check.php'), str(ROOT / 'ports/golden-cases.json')], check=True)
