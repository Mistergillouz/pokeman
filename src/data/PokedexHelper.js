import Pokedex from 'data/pokedex.json'
import Eggs from 'data/eggs.json'
import Constants from 'data/Constants'

class PokedexHelper {
   
    constructor() {

        this.locale = Constants.LOCALES.FRENCH;
    }

    getAttacks(pokemonId) {
        
        let pokemon = this.pokemon(pokemonId), fast = [], charged = []
        if (pokemon.attacks) {
            charged = this._getAttacks(pokemon, pokemon.attacks.charged)
            fast = this._getAttacks(pokemon, pokemon.attacks.fast)
        }
        
        return {
            charged: charged,
            fast: fast
        }
    }

    getEggs() {
        
        return Eggs;        
    }
        
    _getAttacks(pokemon, attacks) {
        
        let result = [];

        if (attacks) {
            attacks.forEach(attackId => {
                let attack = Pokedex.attacks[attackId];
                        
                let bonus = 1;
                pokemon.species.forEach(type => {
                    if (type === attack.type) {
                        bonus = 1.2;
                    }
                });
    
                let dps = _round((attack.dmg / attack.duration) * bonus, 1) ;
                let entry = Object.assign({}, attack, {
                    name:  this.loc(attack),
                    dps: dps
                });
    
                result.push(entry);
            });
        }
    
        result.sort((a, b) => { return b.dps - a.dps; });
        return result;
    }

        
    getEvolvesList(pokemonId) {
        let evolves = [{
            id: pokemonId,
            active: true,
            children: this._getEvolves(pokemonId)
        }];
    
        this._getParents(pokemonId, evolves);
        return evolves;
    }
    
    _getEvolves(pokemonId) {
        let children = [];
        let pokemon = this.pokemon(pokemonId);
        if (pokemon.evolves) {
            pokemon.evolves.forEach((id) => {
    
                let evolutions = { 
                    id: id,
                    children: this._getEvolves(id)
                };
    
                children.push(evolutions)
    
            });
        }
    
        return children;
    };
    
    _getParents(pokemonId, evolves) {
        for (let id in Pokedex.pokemons) {
            let pokemon = Pokedex.pokemons[id];
            if (pokemon.evolves) {
                pokemon.evolves.forEach((aid) => {
                    if (Number(aid) === Number(pokemonId)) {
                        evolves.push( {
                            id: pokemon.id,
                            children: evolves.splice(0, evolves.length)
                        });
    
                        this._getParents(pokemon.id, evolves);
                    }
    
                });
            }
        }
    };

    
    getStrengthWeakness(typeId) {
        let species = this.species(typeId), strong = [], weak = [];
        for (let targetId in species.dmg) {
            let value = species.dmg[targetId];
            if (value !== 100) {
                var against = {
                    id: targetId,
                    amount: value,
                    text: this.loc(this.species(targetId))
                };
                if (value > 100) {
                    strong.push(against);
                } else {
                    weak.push(against);
                }
            }
        }
    
        return {
            strong: strong,
            weak: weak
        };
    }

    search(query) {
            
        let ids = [];
        let textParts = this.normalizeText(query.text.trim().toLowerCase()).split(' ')
        function matchRuleShort(str, rule) {
            return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
          }
        let keys = Object.keys(Pokedex.pokemons)
        keys.forEach(pokemonId => {

            let pokemon = Pokedex.pokemons[pokemonId];
            if (query.genId && pokemon.gen !== query.genId) {
                return;
            }

            if (query.rarity === true && !pokemon.rarity) {
                return
            }

            let name = this.normalizeText(this.loc(pokemon) || '').toLowerCase();
            if (!name.length) {
                return;
            }
    
            if (textParts.length) {
                let found = false
                textParts.forEach(text => {
                    if (keys[text]) {
                        pokemonId = text
                        found = true
                    }
                    else if (_match(name, text)) {
                        found = true
                    }
                })

                if (!found) {
                    return
                }
            }
    
            var rejected = false;
            query.types.forEach((typeId)=> {
                if (pokemon.species.indexOf(typeId) === -1) {
                    rejected = true;
                } 
            });
    
            if (!rejected && ids.indexOf(pokemonId) === -1) {
                ids.push(pokemonId);
            }
        });

        return ids;
    }

    setLocaleCountry(country) {
        for (let key in Constants.LOCALES) {
            let locale = Constants.LOCALES[key];
            if (locale.country === country) {
                this.locale = locale;
            }
        }
    }

    getAllSpecies() {
        let types = [];
        for (let id in Pokedex.species) {
            types.push({ id: Number(id), name: this.loc(this.species(id)), key: this.getSpeciesKey(this.species(id)) });
        }
    
        types.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    
        return types;
    }

    getPokemonName(pokemonId) {
        return this.loc(this.getPokemon(pokemonId))
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

    pokemon(id) {
        return Pokedex.pokemons[id];
    }

    loc(object, locale) {
        return object.loc[locale ? locale.id : this.locale.id];
    }

    getLocaleCountry() {
        return this.locale.country
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
    
    getLocales() {

        let locales = [];
        for (let locale in Constants.LOCALES) {
            locales.push({ id: Constants.LOCALES[locale].country, name: Constants.LOCALES[locale].name });
        }
        return locales;
    }

    toggle(array, value, monoValues) {
        let  index = array.indexOf(value), copy
        if (!monoValues) {
            copy = array.slice()
            if (index !== -1) {
                copy.splice(index, 1);
            } else {
                copy.push(value);
            }

        } else if (index !== -1) {
            copy = [];
        } else {
            copy = [ value ];
        }

        return copy
    }

    getSpeciesKey(species) {
        return this.loc(species, Constants.LOCALES.ENGLISH).toUpperCase()
    }

}

function _round(num, decimals) {
    var n = Math.pow(10, decimals);
    return Math.round( (n * num).toFixed(decimals) )  / n;
}

function _match(str, rule) {
    let regex = new RegExp("^" + rule.split("*").join(".*") + "$")
    return regex.test(str) || str.indexOf(rule) !== -1
}

// Singleton
let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
