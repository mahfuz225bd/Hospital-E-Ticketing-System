from translate import Translator

def en_to_bn(text):
    translator = Translator(from_lang='autodetect', to_lang="bn")
    translation = translator.translate(text)
    return translation

def bn_to_en(text):
    translator = Translator(from_lang='autodetect', to_lang='en')
    translation = translator.translate(text)
    return translation