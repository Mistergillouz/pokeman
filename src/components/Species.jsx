import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import SpeciesTooltip from 'components/SpeciesTooltip'

class Species extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    onShowTooltip(event) {

        if (this.props.onShowTooltip) {
            this.props.onShowTooltip({
                id: this.props.id,
                event: event
            });
        }
    }

    render() { 

        let species = PokedexHelper.getTypeInfos(this.props.id);
        let speciesName = PokedexHelper.loc(species);
        var speciesCss = PokedexHelper.loc(species, PokedexHelper.LOCALES.ENGLISH).toUpperCase();
        
        return (
            <div className={ "type POKEMON_TYPE_" + speciesCss } type-id={ species.id } onClick={ (e) => this.onShowTooltip(e) }>{ speciesName }
            </div>
        )
    }
}

export default Species
