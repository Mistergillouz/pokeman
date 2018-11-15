import React from 'react'
import PokedexHelper from '../data/PokedexHelper'
import Utils from '../data/Utils'

class TypeFilter extends React.Component {
   
    constructor() {
        super(...arguments)
        this.state = {
            types: this.props.types || []
        }
    }

    componentWillReceiveProps(props) {
        if (Array.isArray(props.types)) {
            this.state.types = props.types
        }
    }

    onTypeClicked(typeId) {
        let selectedTypes = Utils.toggle(this.state.types, typeId, Boolean(this.props.isMono))
        this.setState({ selectedTypes: selectedTypes })
        this.props.onTypeClicked(selectedTypes)
    }

    render() { 

        const types = PokedexHelper.getAllSpecies().map((type) => {
            let clazz = 'filter-type-toggle POKEMON_TYPE_' + type.key;
            if (this.state.types.indexOf(type.id) !== -1) {
                clazz += ' filter-type-active'
            }
            if (this.state.types.length === 0) {
                clazz += ' filter-type-inactive'
            }

            return (
                <div key={ type.id }
                    className={ clazz }
                    onClick={() => { this.onTypeClicked(type.id) }}>
                    {type.name}
                </div>
            )
        })
        
        return (
            <div id="type-table-container" className="type-table-container">
                {types}
            </div>
        )
    }
}

export default TypeFilter
