import React from 'react'
import ReactDOM from 'react-dom'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'

class FilterPanel extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            selectedGen: 0,
            selectedTypes: []
        }
    }

    onGenClicked(genNumber) {
        let selectedGen = (genNumber === this.state.selectedGen) ? 0 : genNumber;
        this.props.notifyChange({ genId: selectedGen });
        this.setState({ selectedGen: selectedGen });
    }

    onTypeClicked(typeId) {

        let selectedTypes = PokedexHelper.toggle(this.state.selectedTypes, typeId)
        this.props.notifyChange({ types: selectedTypes });
        this.setState({ selectedTypes: selectedTypes });
    }

    render() { 

        if (this.props.visible) {

            let genButtons = [];

            for (let i = 1; i <= Constants.MAX_GEN; i++) {

                let clazz = (i === 1) ? 'gen-button-left' : (i === Constants.MAX_GEN) ? 'gen-button-right' : 'gen-button-center';
                if (i === this.state.selectedGen) {
                    clazz += ' selected';
                }

                genButtons.push(
                    <label key={ i }
                        className={ "gen-button " + clazz } 
                        onClick={(e) => { this.onGenClicked(i) }}>
                        {i}
                    </label>);
            }

			let types = PokedexHelper.getAllSpecies().map((type) => {
                let clazz = 'filter-type-toggle';
                if (this.state.selectedTypes.indexOf(type.id) !== -1) {
                    clazz += ' selected';
                }
				return (
                    <div key={ type.id }
                        className={ clazz }
                        onClick={(e) => { this.onTypeClicked(type.id) }}>
                        {type.name}
                    </div>
                );
			});

            return (
                <div className="filters-container">
                    <div id="gen-table-container" className="gen-table-container">
                        {genButtons}
                    </div>
                    <div id="type-table-container" className="type-table-container">
                        {types}
                    </div>
                </div>
            )

        } else {
            return null;
        }
    }
}

export default FilterPanel; 
