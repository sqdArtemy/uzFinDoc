"""
This file contains a function with parses json of uzwordnet to out database
"""
import json

from utilities.functions import get_env_variable
from db_init import transaction, db
from models import Word, Sense


with open(get_env_variable("UZWORDNET_FILE"), 'r') as json_file:
    json_content = json.load(json_file)

for word in json_content["@graph"][0]["entry"]:
    with transaction():
        uz_word = Word(
            id=word["@id"],
            written_form=word["lemma"]["writtenForm"],
            part_of_speech=word["partOfSpeech"],
            language="UZ"
        )
        db.session.add(uz_word)
        db.session.flush()
        print(f"Added word: {word['@id']}\n")

        for sense in word["sense"]:
            if Sense.query.filter_by(id=sense["@id"]).count() == 0:
                uz_sense = Sense(
                    id=sense["@id"],
                    synset_ref=sense["synsetRef"]
                )

                db.session.add(uz_sense)
                db.session.flush()
                print(f"Added sense: {sense['@id']}")
            else:
                uz_sense = Sense.query.filter_by(id=sense["@"]).first()

            uz_word.senses.append(uz_sense)
            db.session.flush()
            print(f"Added relationship between word {uz_word.id} and sense {uz_sense.id}\n")
