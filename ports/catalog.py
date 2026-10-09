import argparse
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANGUAGES = ['python', 'java', 'javascript']


def inventory():
    result = {}
    for path in sorted((ROOT / 'src').rglob('*.ts')):
        source = path.read_text(encoding='utf-8')
        names = re.findall(r'^export\s+(?:abstract\s+)?(?:const|function\s*\*?|class)\s+(\w+)', source, re.M)
        result[path.relative_to(ROOT).as_posix()] = names
    return result


def load_coverage(language):
    path = ROOT / 'ports' / language / 'coverage.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--strict', action='store_true')
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    original = inventory()
    mappings = {language: load_coverage(language) for language in LANGUAGES}
    failures = []
    counts = dict.fromkeys(LANGUAGES, 0)
    lines = ['# Каталог реализаций', '', '140 исходных модулей TypeScript и соответствующие реализации Python, Java и JavaScript. Категории и состав модулей повторяют исходную коллекцию, включая структуры данных, паттерны и вспомогательные функции.', '', 'Идеи, оценки сложности, условия применения и примеры: [основной README](../README.md). Запуск: [Python](python/README.md), [Java](java/README.md), [JavaScript](javascript/README.md).', '', '| TypeScript | ' + ' | '.join(LANGUAGES) + ' |', '|---|' + '---|' * len(LANGUAGES)]
    for source, exports in original.items():
        cells = [f'[{source[4:]}](../{source})']
        for language in LANGUAGES:
            entry = mappings[language].get(source)
            target = entry.get('path') if isinstance(entry, dict) else entry
            if target and (ROOT / target).is_file():
                cells.append(f'[{language}]({target.removeprefix("ports/")})')
                counts[language] += 1
                if isinstance(entry, dict) and 'exports' in entry:
                    declared = entry['exports']
                    if isinstance(declared, dict):
                        declared = declared.keys()
                    missing = set(exports) - set(declared)
                    if missing:
                        failures.append(f'{language}: {source}: unmapped exports {sorted(missing)}')
                elif exports:
                    failures.append(f'{language}: {source}: export mapping absent')
            else:
                cells.append('—')
                failures.append(f'{language}: {source}: implementation absent')
        lines.append('| ' + ' | '.join(cells) + ' |')
    print(json.dumps({'modules': len(original), 'mapped': counts, 'issues': len(failures)}, ensure_ascii=False))
    if args.write:
        (ROOT / 'ports' / 'CATALOG.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    if args.strict and failures:
        print('\n'.join(failures))
        raise SystemExit(1)


if __name__ == '__main__':
    main()
