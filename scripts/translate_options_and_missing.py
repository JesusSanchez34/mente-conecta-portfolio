import json
import os
import unicodedata
import re
import time
from deep_translator import GoogleTranslator

def normalize_key(value):
    value = str(value)
    value = unicodedata.normalize('NFD', value)
    value = re.sub(r'[\u0300-\u036f]', '', value)
    value = re.sub(r'[^a-zA-Z0-9]+', '-', value)
    value = re.sub(r'^-+|-+$', '', value)
    return value.lower()

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
payload_all_path = os.path.join(base_path, 'scripts', 'questionnaire_payload_all.json')
es_translation_path = os.path.join(base_path, 'src', 'locales', 'es', 'translation.json')
en_translation_path = os.path.join(base_path, 'src', 'locales', 'en', 'translation.json')

with open(payload_all_path, 'r', encoding='utf-8') as f:
    payload = json.load(f)

def load_translation(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translation(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

es_data = load_translation(es_translation_path)
en_data = load_translation(en_translation_path)

es_questions = es_data.setdefault('questionnaire', {}).setdefault('questionsByText', {})
en_questions = en_data.setdefault('questionnaire', {}).setdefault('questionsByText', {})

es_options = es_data.setdefault('questionnaire', {}).setdefault('optionsByText', {})
en_options = en_data.setdefault('questionnaire', {}).setdefault('optionsByText', {})

all_questions = set()
all_options = set()

for section, questions_list in payload.items():
    for q_item in questions_list:
        pregunta = q_item.get('pregunta', '').strip()
        if pregunta:
            all_questions.add(pregunta)
        
        respuestas = q_item.get('respuestas', [])
        for r_item in respuestas:
            if isinstance(r_item, dict):
                texto = r_item.get('respuesta', '').strip()
                if texto:
                    all_options.add(texto)
            elif isinstance(r_item, str):
                all_options.add(r_item.strip())

translator = GoogleTranslator(source='es', target='en')

# 1. Check/Translate questions
print("Checking questions...")
for q in sorted(all_questions):
    key = normalize_key(q)
    # Ensure Spanish label exists
    es_questions.setdefault(key, {})['label'] = q
    
    # Check English label
    en_entry = en_questions.setdefault(key, {})
    existing_en = en_entry.get('label', '')
    
    if not existing_en or existing_en == q or existing_en.startswith('[TRANSLATE]'):
        try:
            translated = translator.translate(q)
            en_entry['label'] = translated
            print(f"Translated Question: '{q[:40]}...' -> '{translated[:40]}...'")
            time.sleep(0.1)
        except Exception as e:
            print(f"Error translating question '{q[:40]}...': {e}")
            en_entry['label'] = q

# 2. Check/Translate options
print("\nChecking options/answers...")
translated_opt_count = 0
for opt in sorted(all_options):
    key = normalize_key(opt)
    # Ensure Spanish option exists
    es_options[key] = opt
    
    # Check English option
    existing_en = en_options.get(key, '')
    if not existing_en or existing_en == opt:
        # If it's just a number, keep it as is
        if opt.isdigit():
            en_options[key] = opt
            continue
            
        try:
            translated = translator.translate(opt)
            en_options[key] = translated
            translated_opt_count += 1
            print(f"Translated Option: '{opt}' -> '{translated}'")
            time.sleep(0.1)
        except Exception as e:
            print(f"Error translating option '{opt}': {e}")
            en_options[key] = opt

save_translation(es_translation_path, es_data)
save_translation(en_translation_path, en_data)

print(f"\nCompleted! Translated {translated_opt_count} options/answers.")
