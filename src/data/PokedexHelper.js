import {Pokedex} from 'data/pokedex'

class PokedexHelper {
   
    constructor() {
        this.LOCALE = { FRENCH: 5, ENGLISH: 9 };
        this.localeId = this.LOCALE.FRENCH;
    }

    getPokemon(pokemonId) {
        return Pokedex.pokemons[pokemonId];
    }

    getTypeInfos(speciesId) {
        return Pokedex.species[speciesId];
    }

    loc(object, localeId) {
        return object.loc[localeId || this.localeId];
    }
}

let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
