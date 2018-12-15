import React from 'react'
import Utils from '../data/Utils'

import './css/dropdown.less'

export default class Dropdown extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      listVisible: false,
      selectedItem: null
    }

    this.props = {}
  }

  onToggleList () {
    console.log('onToggleList')
  }

  generateList () {
    let items = this.props.list.map(item => {
      let content = (this.props.renderer) ? this.props.renderer(item) : item.name
      return <li>{ content }</li>
    })

    let text = ''; let classes = ''
    if (this.state.selectedItem) {
      text = this.state.selectedItem.name
    } else {
      text = this.props.placeHolder || 'Select a value...'
      classes += ' placeholder'
    }
    let rows = [
      <li onClick={e => this.onToggleList()} className={'first-item ' + classes}>{ text }</li>,
      ...items
    ]

    return rows
  }
  render () {
    return <div className='dropdown' onChange={e => this.props.onChange(e.target.value)}>
      <ul>
        { this.generateList() }
      </ul>
    </div>
  }
}
