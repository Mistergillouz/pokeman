import React from 'react'
import ReactDOM from 'react-dom'
import PokedexHelper from 'data/PokedexHelper'
import Store from 'data/Store'
import Utils from 'data/Utils'
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

        let selectedTypes = Utils.toggle(this.state.selectedTypes, typeId)
        this.setState({ selectedTypes: selectedTypes });
        this.props.notifyChange({ types: selectedTypes });
    }

    onToggleLeg() {
        let rarity = !this.state.rarity
        this.setState({ rarity: rarity })
        this.props.notifyChange({ rarity: rarity });
    }

    render() { 

        let genButtons = Utils.generateGenButtons(this.state.selectedGen, this.onGenClicked.bind(this))
        let types = PokedexHelper.getAllSpecies().map((type) => {
            let clazz = 'filter-type-toggle POKEMON_TYPE_' + type.key;
            if (this.state.selectedTypes.indexOf(type.id) !== -1) {
                    clazz += ' filter-type-active';
                }
            if (this.state.selectedTypes.length === 0) {
                clazz += ' filter-type-inactive';
            }

            return (
                <div key={ type.id }
                    className={ clazz }
                    onClick={(e) => { this.onTypeClicked(type.id) }}>
                    {type.name}
                </div>
            );
        });

        let filterContainerCls = 'filters-container ' + (this.props.visible ? 'filters-container-open' : 'filters-container-closed')
        return (
            <div className={ filterContainerCls }>
                <div id="gen-table-container" className="gen-table-container">
                    {genButtons}
                    <div onClick={ () => this.onToggleLeg() } className={ 'gen-button gen-button-right gen-button-left' + (this.state.rarity ? ' selected': '') }>LEG</div>
                </div>
                <div id="type-table-container" className="type-table-container">
                    {types}
                </div>
            </div>
        )

    }
}

export default FilterPanel; 
