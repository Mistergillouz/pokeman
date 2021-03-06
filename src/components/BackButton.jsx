import React from 'react'
import PokemanLink from './PokemanLink'
import FontIcon from './FontIcon'

export default class BackButton extends React.Component {
  constructor () {
    super(...arguments)
  }

  static get defaultIcon () {
    return 'fa fa-arrow-circle-left'
  }

  render () {
    return (
      <PokemanLink back>
        { this.props.image
          ? <button className={this.props.image}>
            <span className='button-inner'>
              <div className='cercle' />
              <div className='close' />
            </span>
          </button>
          : <FontIcon x2 icon={BackButton.defaultIcon} /> }
      </PokemanLink>
    )
  }
}
