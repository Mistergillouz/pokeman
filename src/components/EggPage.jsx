import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'

class EggPage extends React.Component {
   constructor() {
        super(...arguments)
    }

    onBack() {

        this.props.eventHandler({
            eventType: Constants.EVENT.ZoomPageClosed
        });
    }
    
    render() { 

        if (!this.props.visible) {
            return null;
        }

        let eggs = PokedexHelper.getEggs();

        return (

            <div className="page">
		    </div>
        )
    }
}

export default EggPage; 