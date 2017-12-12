import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import SpeciesTooltip from 'components/SpeciesTooltip'
import Constants from 'data/Constants'

class Species extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    onTypeClicked(event) {

        if (this.props.eventHandler) {
            this.props.eventHandler({
                event: Constants.EVENT.ShowTooltip,
                id: this.props.id,
                x: event.clientX,
                y: event.clientY
            });
            
            event.stopPropagation();
        }
    }

    render() { 

        let species = PokedexHelper.getTypeInfos(this.props.id);
        let speciesName = PokedexHelper.loc(species);
        var speciesCss = PokedexHelper.loc(species, Constants.LOCALES.ENGLISH).toUpperCase();
        
        return (
            <div className={ "type POKEMON_TYPE_" + speciesCss } type-id={ species.id } onClick={ (e) => this.onTypeClicked(e) }>{ speciesName }
            </div>
        )
    }
}

export default Species
