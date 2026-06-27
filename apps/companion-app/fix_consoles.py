import os
import re
from pathlib import Path

src_dir = Path("src")
devlog_path = src_dir / "lib" / "devLog.js"

def get_relative_path(from_file: Path, to_file: Path):
    rel = os.path.relpath(to_file, from_file.parent)
    if not rel.startswith('.'):
        rel = './' + rel
    if rel.endswith('.js'):
        rel = rel[:-3]
    return rel

console_pattern = re.compile(r'console\.(log|warn|error|info)\b')

for p in src_dir.rglob("*.*"):
    if p.suffix not in ['.js', '.jsx']:
        continue
    if 'workers' in p.parts or 'devLog.js' in p.parts:
        continue
    
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not console_pattern.search(content):
        continue
    
    used = set()
    def replacer(m):
        func = m.group(1)
        used.add(f'dev{func.capitalize()}')
        return f'dev{func.capitalize()}'
    
    new_content = console_pattern.sub(replacer, content)
    
    rel_path = get_relative_path(p, devlog_path)
    
    # Find what imports are actually missing from the original content
    missing = [u for u in used if not re.search(fr'\b{u}\b', content)]
    
    if missing:
        import_stmt = f"import {{ {', '.join(missing)} }} from '{rel_path}';"
        lines = new_content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        if last_import != -1:
            lines.insert(last_import + 1, import_stmt)
        else:
            lines.insert(0, import_stmt)
        new_content = '\n'.join(lines)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {p}")
