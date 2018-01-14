import Pokedex from 'data/pokedex.json'
import Eggs from 'data/eggs.json'
import Constants from 'data/Constants'
import Utils from 'data/Utils'

class PokedexHelper {
   
    constructor() {

        this.locale = Constants.LOCALES.FRENCH;
    }

    getAttacks(pokemonId) {
        
        let pokemon = this.getPokemon(pokemonId), fast = [], charged = []
        if (pokemon.attacks) {
            charged = this._getAttacks(pokemon, pokemon.attacks.charged)
            fast = this._getAttacks(pokemon, pokemon.attacks.fast)
        }
        
        return {
            charged: charged,
            fast: fast
        }
    }

    getBabies() {
        
        let babies = []
        Object.keys(Pokedex.pokemons).forEach(pokemonId => {
            if (Pokedex.pokemons[pokemonId].baby) {
                babies.push(pokemonId)
            }
        })

        return babies
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
    
                let dps = Utils.round((attack.dmg / attack.duration) * bonus, 1) ;
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

    getEvolveFromTo(from, to) {

        let result = {}, done = {}
        Object.keys(Pokedex.pokemons).forEach(id => {
            let pokemonId = Number(id)
            if (done[pokemonId]) {
                return
            }

            let pokemon = this.getPokemon(pokemonId)
            if (from.indexOf(pokemon.gen) === -1) {
                return;
            }

            let evolves = [{
                id: pokemonId,
                active: true,
                children: this._getEvolves(pokemonId, to)
            }];

            if (evolves[0].children.length) {
                result[pokemonId] = evolves
                this._gatherEvolveIds(evolves[0], done)
            }

        })

        return result
    }

    _gatherEvolveIds(evolves, done) {
        evolves.children.forEach(evolve => {
            done[evolve.id] = true
            this._gatherEvolveIds(evolve, done)
        })
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
    
    _getEvolves(pokemonId, gens) {
        let children = [];
        let pokemon = this.getPokemon(pokemonId);
        if (pokemon.evolves) {
            pokemon.evolves.forEach((id) => {
                
                if (gens) {
                    let targetPokemon = this.getPokemon(id)
                    if (gens.indexOf(targetPokemon.gen) === -1) {
                        return
                    }
                }

                let evolutions = { 
                    id: id,
                    children: this._getEvolves(id, gens)
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

    getStrengthWeakness(pokemonId) {
        
        let strength, weakness
        let pokemon = this.getPokemon(pokemonId)
        pokemon.species.forEach(damageType => {
            let [str, weak] = this.getDamageStrengthWeakness(damageType)
            if (!strength) {
                strength = str
                weakness = weak
            } else {
                for (let type in strength) {
                    strength[type] *= str[type] / 100
                    weakness[type] *= weak[type] / 100
                }
            }
        })

        return [strength, weakness]
    }

    getDamageStrengthWeakness(damageType) {
        let species = this.getSpecies(damageType), strength = {}
        Object.keys(species.dmg).forEach(id => strength[id] = species.dmg[id])
        
        let damageTypes = this.species(), weakness = {}
        Object.keys(damageTypes).forEach(id => weakness[id] = damageTypes[id].dmg[damageType])

        return [strength, weakness]
    }

    // getStrengthWeakness(typeId) {
    //     let species = this.getSpecies(typeId), strong = [], weak = [];
    //     for (let targetId in species.dmg) {
    //         let value = species.dmg[targetId];
    //         if (value !== 100) {
    //             var against = {
    //                 id: targetId,
    //                 amount: value,
    //                 text: this.loc(this.getSpecies(targetId))
    //             };
    //             if (value > 100) {
    //                 strong.push(against);
    //             } else {
    //                 weak.push(against);
    //             }
    //         }
    //     }
    
    //     return {
    //         strong: strong,
    //         weak: weak
    //     };
    // }

    search(query) {
            
        let ids = [];
        let textParts = Utils.normalizeText(query.text.trim().toLowerCase()).split(' ')
        function matchRuleShort(str, rule) {
            return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
          }
        let keys = Object.keys(Pokedex.pokemons)
        keys.forEach(pokemonId => {

            let pokemon = Pokedex.pokemons[pokemonId];
            if (query.genId && pokemon.gen !== query.genId) {
                return;
            }

            if (query.rarity === true && LEGENDARY.indexOf(Number(pokemonId)) === -1) {
                return
            }

            let name = Utils.normalizeText(this.loc(pokemon) || '').toLowerCase();
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
                    else if (Utils.match(name, text)) {
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

    species() {
        return Pokedex.species
    }
    
    getAllSpecies() {
        let types = [];
        for (let id in Pokedex.species) {
            let species = this.getSpecies(id)
            types.push({ id: Number(id), name: this.loc(species), key: this.getSpeciesKey(species), dmg: species.dmg });
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

    getSpecies(speciesId) {
        return Pokedex.species[speciesId];
    }

    loc(object, locale) {
        return object.loc[locale ? locale.id : this.locale.id];
    }

    getLocaleCountry() {
        return this.locale.country
    }
    
    getLocales() {

        let locales = [];
        for (let locale in Constants.LOCALES) {
            locales.push({ id: Constants.LOCALES[locale].country, name: Constants.LOCALES[locale].name });
        }
        return locales;
    }

    getSpeciesKey(species) {
        return this.loc(species, Constants.LOCALES.ENGLISH).toUpperCase()
    }

    enumPokemons(callback) {
        Object.keys(Pokedex.pokemons).forEach(pokemonId => {
            return callback(Pokedex.pokemons[pokemonId], pokemonId)
        })
    }

}


const LEGENDARY = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649]

// Singleton
let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
