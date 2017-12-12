import React from 'react'
import ReactDOM from 'react-dom'
import PokedexHelper from 'data/PokedexHelper'

class FilterPanel extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            visible: false,
            selectedGen: 0,
            selectedTypes: []
        }
    }

    toggle() {
        this.setState({ visible: !this.state.visible });
    }

    onGenClicked(genNumber) {
        let selectedGen = (genNumber === this.state.selectedGen) ? 0 : genNumber;
        this.props.notifyChange({ genId: selectedGen });
        this.setState({ selectedGen: selectedGen });
    }

    onTypeClicked(typeId) {

        let selectedTypes = this.state.selectedTypes.slice();
        let index = selectedTypes.indexOf(typeId);
        if (index !== -1) {
            selectedTypes.splice(index, 1);
        } else {
            selectedTypes.push(typeId);
            selectedTypes.splice(2);
        }

        this.props.notifyChange({ types: selectedTypes });
        this.setState({ selectedTypes: selectedTypes });
    }

    componentDidUpdate() {
        let height = 0, node = ReactDOM.findDOMNode(this);
        if (node) {
            height = node.getBoundingClientRect().bottom;
        }
        this.props.notifyChange(null, height);
    }

    render() { 

        if (this.state.visible) {

            let genButtons = [];

            for (let i = 1; i <= PokedexHelper.MAX_GEN; i++) {

                let clazz = (i === 1) ? 'gen-button-left' : (i === PokedexHelper.MAX_GEN) ? 'gen-button-right' : 'gen-button-center';
                if (i === this.state.selectedGen) {
                    clazz += ' selected';
                }

                genButtons.push(
                    <label 
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
                    <div 
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
