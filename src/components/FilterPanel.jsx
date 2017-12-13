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

        let selectedTypes = this.state.selectedTypes.slice();
        let index = selectedTypes.indexOf(typeId);
        if (index !== -1) {
            selectedTypes.splice(index, 1);
        } else {
            selectedTypes.push(typeId);
            //selectedTypes.splice(0, 0, typeId);
            //selectedTypes.splice(2);
        }

        this.props.notifyChange({ types: selectedTypes });
        this.setState({ selectedTypes: selectedTypes });
    }

    componentDidUpdate() {
        this.updateHeight();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateHeight.bind(this));
        window.addEventListener("orientationchange", this.updateHeight.bind(this));
    }

    updateHeight() {
/* 
        if (!this.props.visible) {
            return;
        }

        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {

            let height = 0, node = ReactDOM.findDOMNode(this);
            if (node) {
                height = node.getBoundingClientRect().bottom;
            }

            this.props.notifyChange(null, height);
            delete this.timerId;

        }, 100);
*/
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