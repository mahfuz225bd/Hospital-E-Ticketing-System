from langid.langid import LanguageIdentifier, model

# init langid
identifier = LanguageIdentifier.from_modelstring(model, norm_probs=True)
identifier.set_languages(['bn', 'en'])


def is_en(text):
        return identifier.classify(text)[0] == 'en'

def is_bn(text):
    return identifier.classify(text)[0] == 'bn'