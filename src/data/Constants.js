
const Constants = {

    APPNAME: 'Pokéman',
    EVENT: {
        ShowTooltip: 'ShowTooltip',
        HideTooltip: 'HideTooltip',
        PokemonClicked: 'PokemonClicked',
        PokemonSelected: 'PokemonSelected',
        ComparePage: 'ComparePage',
        LocaleSelected: 'LocaleSelected',
        Back: 'Back',
        EggPage: 'EggPage',
        EvolutionPage: 'EvolutionPage',
        BabiesPage: 'BabiesPage',
        CalculationPage: 'CalculationPage'
    },

    MAX_GEN: 7,
    CURRENT_GEN: 4,
    LOCALES: { 
        FRENCH: { country: 'fr', name: 'Français', id: 5 }, 
        ENGLISH: { country: 'en', name: 'English', id: 9 }
    },

    SELECT: {
        SELECT_ALL: -1,
        UNSELECT_ALL: -2
    },

    SPECIES: {
        NORMAL: 1, FIGHTING: 2, FLYING: 3, POISON: 4, GROUND: 5, ROCK: 6,
        BUG: 7, GHOST: 8, STEEL: 9, FIRE: 10, WATER: 11, GRASS: 12,
        ELECTRIC: 13, PSYCHIC: 14, ICE: 15, DRAGON: 16, DARK: 17, FAIRY: 18
    }
}

Constants.METEO = {
    SUNNY: [ Constants.SPECIES.FIRE, Constants.SPECIES.GRASS, Constants.SPECIES.GROUND ],
    PARTLY_CLOUDY: [Constants.SPECIES.NORMAL, Constants.SPECIES.ROCK],
    CLOUDY: [Constants.SPECIES.FAIRY, Constants.SPECIES.FIGHTING, Constants.SPECIES.POISON],
    RAIN: [Constants.SPECIES.WATER, Constants.SPECIES.ELECTRIC, Constants.SPECIES.BUG],
    SNOW: [Constants.SPECIES.ICE, Constants.SPECIES.STEEL],
    FOG: [Constants.SPECIES.DARK, Constants.SPECIES.GHOST],
    WINDY: [Constants.SPECIES.DRAGON, Constants.SPECIES.FLYING, Constants.SPECIES.PSYCHIC]
}


export default Constants;

