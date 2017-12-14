import {Pokedex} from 'data/pokedex'
import Constants from 'data/Constants'

class PokedexHelper {
   
    constructor() {

        this.locale = Constants.LOCALES.FRENCH;
    }

    getAttacks(pokemonId) {
        
        let pokemon = this.pokemon(pokemonId);
        let charged = this._getAttacks(pokemon, Pokedex.attacks.charged);
        let fast = this._getAttacks(pokemon, Pokedex.attacks.fast);
        
        return {
            charged: charged,
            fast: fast
        };
    }

    getEggs() {
        
        return {    
            "2":[325,316,265,263,261,223,218,200,190,175,174,173,172,167,102,98,92,79,74,66,63,50,43,32,29],
            "5":[360,355,353,298,296,285,258,255,252,240,239,238,236,234,231,228,226,220,216,215,213,211,209,207,206,204,203,202,194,187,183,177,170,158,155,152,140,138,133,127,123,114,111,109,108,104,100,96,95,90,88,86,77,60,58],
            "10":[302,287,280,246,241,227,185,179,147,143,142,137,131,113]
        };        
    }
        
    _getAttacks(pokemon, attacks) {
        
        let result = [];
        attacks.forEach(attack => {
            attack.pokemons.forEach(id => {
                if (id === pokemon.id) {
                    
                    var bonus = 1;
                    pokemon.species.forEach(type => {
                        if (type === attack.type) {
                            bonus = 1.2;
                        }
                    });
        
                    var entry = Object.assign({}, attack, {
                        name:  this.loc(attack),
                        dps: this._round(attack.rawdps * bonus, 1)
                    });
        
                    result.push(entry);
                }
            });
        });
    
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
    };
    
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
                pokemon.evolves.forEach((id) => {
                    if (id === pokemonId) {
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

    pokemon(id) {
        return Pokedex.pokemons[id];
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
    
    getLocales() {

        let locales = [];
        for (let locale in Constants.LOCALES) {
            locales.push({ id: Constants.LOCALES[locale].country, name: Constants.LOCALES[locale].name });
        }
        return locales;
    }
    
    _round(num, decimals) {
        var n = Math.pow(10, decimals);
        return Math.round( (n * num).toFixed(decimals) )  / n;
    }
}

// Singleton
let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
