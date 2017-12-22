import React from 'react'
import Lazimage from 'components/Lazimage'

class SmallPokemon extends React.Component {
   constructor() {
        super(...arguments)
    }

    render() {

        let clazz = this.props.selected ? 'egg-pokemon-selected' : ''
        return (<div className={ 'egg-pokemon ' + clazz } onClick = { () => this.props.onClick(this.props.id) }>
                    <Lazimage className="egg-pokemon-img"
                        key={ this.props.id } 
                        src='../assets/images/wait.gif'
                        target={ 'https://www.serebii.net/art/th/' + this.props.id + '.png' }/>
                    <label className="egg-pokemon-img-text">{ this.props.name }</label>
                </div>
        )
    }
}

export default SmallPokemon