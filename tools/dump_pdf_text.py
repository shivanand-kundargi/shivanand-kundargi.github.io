from pdfminer.high_level import extract_text
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "Shivanand_Kundargi_CV (1).pdf"
print(extract_text(path))

