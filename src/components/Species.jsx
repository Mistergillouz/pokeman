import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

class Species extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    render() { 

        let species = PokedexHelper.getTypeInfos(this.props.id);
        let speciesName = PokedexHelper.loc(species);
        var speciesCss = PokedexHelper.loc(species, PokedexHelper.LOCALE.ENGLISH).toUpperCase();
        
        return (
            <div className={ "type POKEMON_TYPE_" + speciesCss + " type-id=" + species.id}>{speciesName}</div>
        )
    }
}

export default Species
