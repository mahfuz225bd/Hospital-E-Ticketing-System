from translate import Translator
from langid.langid import LanguageIdentifier, model

# init langid
identifier = LanguageIdentifier.from_modelstring(model, norm_probs=True)
identifier.set_languages(['bn', 'en'])

class EnBnTranslator:
    def __init__(self, text):
        self.text = text

    def en_to_bn(text):
        translator = Translator(from_lang='en', to_lang='bn')
        translation = translator.translate(text)
        return translation

    def bn_to_en(text):
        translator = Translator(from_lang='bn', to_lang='en')
        translation = translator.translate(text)
        return translation

    def is_en(text):
        return identifier.classify(text)[0] == 'en'

    def is_bn(text):
        return identifier.classify(text)[0] == 'bn'