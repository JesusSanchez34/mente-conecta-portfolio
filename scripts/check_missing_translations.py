import json
import os
import unicodedata
import re

def normalize_key(value):
    value = str(value)
    value = unicodedata.normalize('NFD', value)
    value = re.sub(r'[\u0300-\u036f]', '', value)
    value = re.sub(r'[^a-zA-Z0-9]+', '-', value)
    value = re.sub(r'^-+|-+$', '', value)
    return value.lower()

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
payload_all_path = os.path.join(base_path, 'scripts', 'questionnaire_payload_all.json')
en_translation_path = os.path.join(base_path, 'src', 'locales', 'en', 'translation.json')

with open(payload_all_path, 'r', encoding='utf-8') as f:
    payload = json.load(f)

with open(en_translation_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

en_questions = en_data.get('questionnaire', {}).get('questionsByText', {})
en_options = en_data.get('questionnaire', {}).get('optionsByText', {})

all_questions = set()
all_options = set()

for section, questions_list in payload.items():
    for q_item in questions_list:
        pregunta = q_item.get('pregunta', '').strip()
        if pregunta:
            all_questions.add(pregunta)
        
        respuestas = q_item.get('respuestas', [])
        for r_item in respuestas:
            # Let's inspect the keys of r_item
            # Usually it has 'texto' or similar. Let's check keys of first response if any
            if isinstance(r_item, dict):
                texto = r_item.get('texto', r_item.get('respuesta', '')).strip()
                if texto:
                    all_options.add(texto)
            elif isinstance(r_item, str):
                all_options.add(r_item.strip())

print(f"Total questions in payload_all: {len(all_questions)}")
print(f"Total options in payload_all: {len(all_options)}")

# Let's check which questions are not in en_questions
missing_questions = []
for q in sorted(all_questions):
    key = normalize_key(q)
    if key not in en_questions:
        missing_questions.append((q, "Not in translation file"))
    else:
        label = en_questions[key].get('label', '')
        if not label or label == q:
            # If the label is empty or identical, check if it's actually in Spanish
            # (Note: some English labels might naturally be similar, but let's list them)
            # Actually, if label == q, it might mean it was not translated.
            # But let's check.
            missing_questions.append((q, f"Label is same as Spanish: {label}"))

# Let's check which options are not in en_options
missing_options = []
for opt in sorted(all_options):
    # Let's see how option keys are normalized. Usually optionsByText has keys that are normalized.
    # Let's check how the frontend handles option translation.
    # We should search the codebase for optionsByText or how option keys are generated.
    key = normalize_key(opt)
    if key not in en_options:
        missing_options.append(opt)

print(f"\nMissing/Untranslated questions count: {len(missing_questions)}")
for q, status in missing_questions[:10]:
    print(f"- {q[:50]}... ({status})")

print(f"\nMissing/Untranslated options count: {len(missing_options)}")
for opt in missing_options:
    print(f"- {opt}")
