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
en_translation_path = os.path.join(base_path, 'src', 'locales', 'en', 'translation.json')

with open(en_translation_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

en_questions = en_data.setdefault('questionnaire', {}).setdefault('questionsByText', {})

q1 = "Si es así: ¿Actualmente, consideran extrañas sus ideas?"
q2 = "Si es así: ¿Actualmente, cree estas cosas?"

key1 = normalize_key(q1)
key2 = normalize_key(q2)

en_questions[key1] = {"label": "If so: Do they currently consider your ideas strange?"}
en_questions[key2] = {"label": "If so: Do you currently believe these things?"}

with open(en_translation_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Updated 2 special questions in English.")
