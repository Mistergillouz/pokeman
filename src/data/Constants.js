
const Constants = {

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
        BabiesPage: 'BabiesPage'
    },

    MAX_GEN: 7,
    LOCALES: { 
        FRENCH: { country: 'fr', name: 'Français', id: 5 }, 
        ENGLISH: { country: 'en', name: 'English', id: 9 }
    },

    SELECT: {
        SELECT_ALL: -1,
        UNSELECT_ALL: -2
    }
}

export default Constants;

