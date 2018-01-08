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
                eventType: Constants.EVENT.ShowTooltip,
                id: this.props.id,
                event: event
            });
            
            event.stopPropagation();
        }
    }

    render() { 

        let species = PokedexHelper.getTypeInfos(this.props.id);
        let speciesName = PokedexHelper.loc(species);
        var speciesCss = PokedexHelper.getSpeciesKey(species);
        
        return (
            <div key={ speciesCss } className={ 'type POKEMON_TYPE_' + speciesCss } type-id={ species.id } 
                onMouseDown={ e => e.stopPropagation() }
                onTouchStart={ e => e.stopPropagation() }
                onMouseUp={ e => this.onTypeClicked(e) }
                onTouchEnd={ e => this.onTypeClicked(e) }>{ speciesName }
            </div>
        )
    }
}

export default Species
