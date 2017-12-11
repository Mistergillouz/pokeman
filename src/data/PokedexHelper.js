import {Pokedex} from 'data/pokedex'

const LOCALE = { FRENCH: 5, ENGLISH: 9 };

class PokedexHelper {
   
    constructor() {
        this.localeId = LOCALE.FRENCH;
    }

    getPokemon(pokemonId) {
        return Pokedex.pokemons[pokemonId];
    }

    getTypes(speciesId) {
        return Pokedex.species[speciesId];
    }

    loc(object, localeId) {
        return object.loc[localeId || this.localeId];
    }
}

let PokedexHelperObj = new PokedexHelper();

export default PokedexHelperObj
