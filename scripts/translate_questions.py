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
unique_questions_path = os.path.join(base_path, 'scripts', 'unique_spanish_questions.json')
es_translation_path = os.path.join(base_path, 'src', 'locales', 'es', 'translation.json')
en_translation_path = os.path.join(base_path, 'src', 'locales', 'en', 'translation.json')

with open(unique_questions_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

def load_translation(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translation(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

es_data = load_translation(es_translation_path)
en_data = load_translation(en_translation_path)

es_qbytext = es_data.setdefault('questionnaire', {}).setdefault('questionsByText', {})
en_qbytext = en_data.setdefault('questionnaire', {}).setdefault('questionsByText', {})

translator = GoogleTranslator(source='es', target='en')

print(f"Loaded {len(questions)} unique questions.")
translated_count = 0
skipped_count = 0

for i, q in enumerate(questions):
    key = normalize_key(q)
    
    # Check Spanish entry
    es_entry = es_qbytext.setdefault(key, {})
    es_entry['label'] = q
    
    # Check English entry
    en_entry = en_qbytext.setdefault(key, {})
    existing_en = en_entry.get('label', '')
    
    # If the English translation is already present and different from Spanish, skip translation
    if existing_en and existing_en != q and not existing_en.startswith('[TRANSLATE]'):
        skipped_count += 1
        continue
        
    # Translate
    try:
        translated = translator.translate(q)
        en_entry['label'] = translated
        translated_count += 1
        print(f"[{i+1}/{len(questions)}] Translated: '{q[:30]}...' -> '{translated[:30]}...'")
        # Gentle rate limiting
        time.sleep(0.1)
    except Exception as e:
        print(f"Error translating '{q[:30]}...': {e}")
        # Fallback to original
        en_entry['label'] = q

save_translation(es_translation_path, es_data)
save_translation(en_translation_path, en_data)

print(f"\nDone! Translated {translated_count} questions, skipped {skipped_count} already translated.")
