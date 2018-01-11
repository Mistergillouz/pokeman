import React from 'react'
import ReactDOM from 'react-dom'
import PokedexHelper from 'data/PokedexHelper'
import Store from 'data/Store'
import Constants from 'data/Constants'

const KEY = 'filters'

class FilterPanel extends React.Component {
   constructor() {
        super(...arguments)

        this.state = Store.get(KEY, {
            selectedGen: 0,
            selectedTypes: [],
            rarity: false
        })
    }

    setState(args) {
        super.setState(args)
        Store.set(KEY, args)
    }

    onGenClicked(genNumber) {
        let selectedGen = (genNumber === this.state.selectedGen) ? 0 : genNumber;
        this.setState({ selectedGen: selectedGen });
        this.props.notifyChange({ genId: selectedGen });
    }

    onTypeClicked(typeId) {

        let selectedTypes = PokedexHelper.toggle(this.state.selectedTypes, typeId)
        this.setState({ selectedTypes: selectedTypes });
        this.props.notifyChange({ types: selectedTypes });
    }

    onToggleLeg() {
        let rarity = !this.state.rarity
        this.setState({ rarity: rarity })
        this.props.notifyChange({ rarity: rarity });
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
                        <div onClick={ () => this.onToggleLeg() } className={ 'gen-button gen-button-right gen-button-left' + (this.state.rarity ? ' selected': '') }>Lég</div>
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
