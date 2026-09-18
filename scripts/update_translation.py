import json, os, unicodedata, re

def normalize_key(value):
    # replicate JS normalizeKey logic
    # NFD normalization, strip diacritics, replace non-alphanum with '-', trim hyphens, lowercase
    value = str(value)
    value = unicodedata.normalize('NFD', value)
    value = re.sub(r'[\u0300-\u036f]', '', value)
    value = re.sub(r'[^a-zA-Z0-9]+', '-', value)
    value = re.sub(r'^-+|-+$', '', value)
    return value.lower()

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# paths
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

def update_translation(data, lang='es'):
    # ensure nested structure
    questionnaire = data.setdefault('questionnaire', {})
    qbytext = questionnaire.setdefault('questionsByText', {})
    for q in questions:
        key = normalize_key(q)
        entry = qbytext.setdefault(key, {})
        if 'label' not in entry:
            entry['label'] = q if lang == 'es' else q  # placeholder, could be translated later
    return data

es_data = load_translation(es_translation_path)
en_data = load_translation(en_translation_path)

es_data = update_translation(es_data, 'es')
en_data = update_translation(en_data, 'en')

save_translation(es_translation_path, es_data)
save_translation(en_translation_path, en_data)

print('Translation files updated with', len(questions), 'questions.')
