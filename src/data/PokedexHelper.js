import {Pokedex} from 'data/pokedex'

class PokedexHelper {
   
    constructor() {

        this.MAX_GEN = 7;

        this.LOCALES = { 
            FRENCH: { country: 'fr', id: 5 }, 
            ENGLISH: { country: 'en', id: 9 }
        };

        this.locale = this.LOCALES.FRENCH;
    }

    search(query) {
            
        let ids = [];
        
        let text = this.normalizeText(query.text.trim().toLowerCase());

        Object.keys(Pokedex.pokemons).forEach((pokemonId) => {

            let pokemon = Pokedex.pokemons[pokemonId];
            if (query.genId && pokemon.gen !== query.genId) {
                return;
            }
    
            if (text.length) {
                var name = this.normalizeText(this.loc(pokemon) || '').toLowerCase();
                if (!name.length || name.indexOf(text) === -1) {
                    return;
                }
            }
    
            var rejected = false;
            query.types.forEach((typeId)=> {
                if (pokemon.species.indexOf(typeId) === -1) {
                    rejected = true;
                } 
            });
    
            if (!rejected) {
                ids.push(pokemonId);
            }
        });

        return ids;
    }

    setLocaleCountry(country) {
        for (let key in this.LOCALES) {
            let locale = this.LOCALES[key];
            if (locale.country === country) {
                this.locale = locale;
            }
        }
    }

    getAllSpecies() {
        let types = [];
        for (let id in Pokedex.species) {
            types.push({ id: Number(id), name: this.loc(this.species(id)) });
        }
    
        types.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    
        return types;
    }

    getPokemon(pokemonId) {
        return Pokedex.pokemons[pokemonId];
    }

    getTypeInfos(speciesId) {
        return Pokedex.species[speciesId];
    }

    species(speciesId) {
        return Pokedex.species[speciesId];
    }

    loc(object, locale) {
        return object.loc[locale ? locale.id : this.locale.id];
    }

    normalizeText(text) {
        
        const subs = [
            [ 'é', 'e' ],
            [ 'è', 'e' ],
            [ 'ê', 'e' ],
            [ 'ë', 'e' ],
            [ 'à', 'a' ],
            [ 'â', 'a' ],
            [ 'ä', 'a' ]
        ];
        
        let string = text = text.trim().toLowerCase();
        subs.forEach((sub) => {
            string = this.replaceAll(string, sub[0], sub[1]);
        });
    
        return string;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    
}

let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
