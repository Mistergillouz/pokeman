import Fuse from 'fuse.js'
import Pokedex from './pokedex.json'
import Eggs from './eggs.json'
import Constants from './Constants'
import Utils from './Utils'

class PokedexHelper {
   
    constructor () {

        this.locale = Constants.LOCALES.FRENCH;
        this.rankings = null
        this.fuseDatas = null
        this.config = null
    }

    setConfig(config) {
        this.config = config
    }

    getShinies () {
        return this.config.shinies
    }

    searchAttacks(typeIds, inputSearchText, charged) {

        const list = {}
        if (typeIds.length || Boolean(inputSearchText) || typeof charged === 'boolean') {

            let result = Object.keys(Pokedex.attacks).filter(id => {
                const attack = Pokedex.attacks[id]
                if (typeIds.length && typeIds.indexOf(attack.type) === -1) {
                    return false
                }
                return typeof charged !== 'boolean' || charged === Boolean(attack.energy < 0) 
            })

            const searchText = (inputSearchText || '').trim()
            if (searchText) {
                const fuseData = result.map(id => ({
                    name: this.loc(Pokedex.attacks[id]),
                    id
                }))

                const fuse = new Fuse(fuseData, {
                    keys: [ 'name' ],
                    threshold: 0.3,
                    id: 'id'
                })

                result = fuse.search(searchText)
            }

            result.forEach(id => {
                const attack = Pokedex.attacks[id]
                const isCharged = Boolean(attack.energy < 0)
                this.enumPokemons(pokemon => {
                    if (pokemon.attacks) {
                        const pokemonAttacks = isCharged ? pokemon.attacks.charged : pokemon.attacks.fast
                        if (pokemonAttacks.some(pokemonAttackId => pokemonAttackId === Number(id))) {
                            if (!list[id]) {
                                list[id] = Object.assign({}, Pokedex.attacks[id], { pokemons: [] })
                            }
        
                            list[id].pokemons.push(pokemon)
                        }
                    }
                })
            })
        }

        const result = Object.keys(list)
            .map(id => list[id])
            .sort((a, b) => this.loc(a).localeCompare(this.loc(b)))

        return result
    }

    getImagePath (pokemon, isShiny) {
        let path = '../assets/pokemons/', id = pokemon.id
        if (isShiny) {
            path += 'shiny/'
        }
        else if (pokemon.form && pokemon.form.alola) {
            path += 'alola/'
            id = pokemon.form.parent
        }
        
        return path + id + '.png'
    }

    getBigImagePath (pokemon, isShiny) {
        let path = '../assets/pokemons-big/', id = pokemon.id
        if (isShiny) {
            path += 'shiny/'
        }
        else if (pokemon.form && pokemon.form.alola) {
            path += 'alola/'
            id = pokemon.form.parent
        }
        
        return path + id + '.png'
    }

    getForms() {
        let forms = {}
        this.enumPokemons(pokemon => {
            if (pokemon.form) {
                const parent = pokemon.form.parent
                if (!forms[parent]) {
                    forms[parent] = []
                }

                forms[parent].push(pokemon)
            }    
        })

        return forms
    }

    getRankings(pokemonId) {

        const attributes = [ 'cpmax', 'atk', 'def', 'sta' ]
        let pokemon = this.getPokemon(pokemonId)
        if (!pokemon || pokemon.gen > Constants.CURRENT_GEN) {
            return null
        }

        if (!this.rankings) {
            let rankings = {}, count = 0
            attributes.forEach(attribute => rankings[attribute] = [])
            this.enumPokemons(pokemon => {
                if (pokemon.gen <= Constants.CURRENT_GEN) {
                    attributes.forEach(attribute => rankings[attribute].push(pokemon[attribute]))
                    count++
                }
            })

            rankings.count = count
            attributes.forEach(attribute => rankings[attribute].sort((a, b) => b - a))
            this.rankings = rankings
        }

        let results = { count: this.rankings.count }
        attributes.forEach(attribute => results[attribute] = _getRank(this.rankings[attribute], pokemon[attribute]))
        return results
    }

    getAttack(attackId) {
        return Pokedex.attacks[attackId]
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
            for (let attackId of attacks) {
                const attack = Pokedex.attacks[attackId];
                        
                let bonus = 1;
                for (let type of pokemon.species) {
                    if (type === attack.type) {
                        bonus = 1.2;
                    }
                }
    
                const dps = Utils.round((attack.dmg / attack.duration) * bonus, 1);
                const dpe = attack.energy < 0 ? attack.dmg / Math.abs(attack.energy) : 1
                const entry = Object.assign({}, attack, {
                    name:  this.loc(attack),
                    dps,
                    rating: dps * dpe
                });
    
                result.push(entry);
            }
        }
    
        result.sort((a, b) => { return b.rating - a.rating; });
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

            if (evolves[0].children && evolves[0].children.length) {
                result[pokemonId] = evolves
                this._gatherEvolveIds(evolves[0], done)
            }

        })

        return result
    }

    _gatherEvolveIds(evolves, done) {
        if (evolves.children) {
            for (let evolve of evolves.children) {
                done[evolve.id] = true
                this._gatherEvolveIds(evolve, done)
            }
        }
    }
        
    getEvolvesList(pokemonId) {
        let evolves = [{
            id: pokemonId,
            active: true,
            children: this._enumEvolves(pokemonId)
        }];
    
        this._getParents(pokemonId, evolves);
        return evolves;
    }
    
    _getEvolves(pokemonId, to) {
        let evolves = this._enumEvolves(pokemonId)
        let inGens = this._evolvesInGen(evolves, to)
        return inGens ? evolves : null
    }

    _evolvesInGen(evolves, gens) {
        for (let evolve of evolves) {
            let pokemon = this.getPokemon(evolve.id)
            if (gens && gens.indexOf(pokemon.gen) !== -1) {
                return true
            }
            for (let child of evolve.children) {
                if (this._evolvesInGen([child], gens)) {
                    return true
                }
            }
        }

        return false
    }

    _enumEvolves(pokemonId) {
        let children = []
        let pokemon = this.getPokemon(pokemonId);
        if (pokemon.evolves) {
            for (let id of pokemon.evolves) {
                let evolutions = { 
                    id: id,
                    children: this._enumEvolves(id)
                };
    
                children.push(evolutions)
    
            }
        }
    
        return children
    }
    
    _getParents(pokemonId, evolves) {
        for (let id in Pokedex.pokemons) {
            let pokemon = Pokedex.pokemons[id];
            if (pokemon.evolves) {
                for (let aid of pokemon.evolves) {
                    if (Number(aid) === Number(pokemonId)) {
                        evolves.push( {
                            id: pokemon.id,
                            children: evolves.splice(0, evolves.length)
                        });
    
                        this._getParents(pokemon.id, evolves);
                    }
                }
            }
        }
    };

    getStrengthWeakness(pokemonId) {
        
        let pokemon = this.getPokemon(pokemonId)
        if (pokemon) {
            return this.getSpeciesStrengthWeakness(pokemon.species)
        }
    }

    getSpeciesStrengthWeakness(species) {
        let strength, weakness
        for (let damageType of species) {
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
        }

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
            
        let ids = [], text = query.text.trim()
        if (text.length) {
            const fuse = new Fuse(this.getFuseDatas(), {
                keys: [ 'name', 'form' ],
                threshold: 0.4,
                id: 'id'
            })
            text.split(' ').forEach(part => {
                if (isNaN(part)) {
                    ids = ids.concat(fuse.search(part))
                } else {
                    ids.push(part)
                }
            })
        } else {
            ids = Object.keys(Pokedex.pokemons)
        }
        
        let result = []
        for (let pokemonId of ids) {

            let pokemon = Pokedex.pokemons[pokemonId];
            if (query.genId && pokemon.gen !== query.genId) {
                continue
            }

            if (query.rarity === true && !this.isLegendary(pokemonId)) {
                continue
            }

            var rejected = false;
            for (let typeId of query.types) {
                if (pokemon.species.indexOf(typeId) === -1) {
                    rejected = true;
                } 
            }
    
            if (!rejected) {
                result.push(pokemonId);
            }
        }

        return result.filter((item, pos) => result.indexOf(item) === pos)
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
        return object.loc[locale ? locale.country : this.locale.country];
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

    isLegendary(pokemonId) {
        return LEGENDARY.indexOf(Number(pokemonId)) !== -1
    }

    getFuseDatas() {
        const fuseDatas = Object.keys(Pokedex.pokemons).map(id => {
            const pokemon = Pokedex.pokemons[id]
            const result = {
                name: this.loc(pokemon),
                id: pokemon.id
            }
        
            if (pokemon.form) {
                result.form = this.loc(pokemon.form)
            }
        
            return result
        })
    
        return fuseDatas
    }

}

function _getRank(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (value >= array[i]) {
            return i
        }
    }

    return -1
}

const LEGENDARY = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649]

// Singleton
let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
