from pdfminer.high_level import extract_text
import re
import sys

def main(path: str):
    text = extract_text(path)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    cands = []
    for i, l in enumerate(lines):
        if re.search(r"\b(20[12][0-9])\b", l) and re.search(r"CVPR|AAAI|3DV|ICCV|ECCV|NeurIPS|ICLR|WACV|TPAMI|TMLR|ICML|arXiv", l, re.I):
            cands.append(i)
    entries = []
    seen = set()
    for idx in cands:
        start = max(0, idx - 2)
        end = min(len(lines), idx + 3)
        block = ' '.join(lines[start:end])
        if block not in seen:
            seen.add(block)
            entries.append(block)
    if not entries:
        for i, l in enumerate(lines):
            if re.search(r"\b(20[12][0-9])\b", l) and ("," in l or "." in l):
                block = ' '.join(lines[max(0, i - 2):min(len(lines), i + 3)])
                if block not in seen:
                    seen.add(block)
                    entries.append(block)
    for e in entries[:10]:
        print("---PUB---")
        print(e)

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "Shivanand_Kundargi_CV (1).pdf"
    main(path)

