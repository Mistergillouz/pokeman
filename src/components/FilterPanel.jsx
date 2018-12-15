import React from 'react'
import Store from '../data/Store'
import Utils from '../data/Utils'
import TypeFilter from './TypeFilter'

const KEY = 'filters'

class FilterPanel extends React.Component {
  constructor () {
    super(...arguments)

    this.state = Store.get(KEY, {
      selectedGen: 0,
      rarity: false,
      types: []
    })
  }

  componentWillReceiveProps (props) {
    if (Array.isArray(props.types)) {
      this.state.types = props.types
    }
  }

  setState (args) {
    super.setState(args)
    Store.set(KEY, args)
  }

  onGenClicked (genNumber) {
    let selectedGen = (genNumber === this.state.selectedGen) ? 0 : genNumber
    this.setState({ selectedGen: selectedGen })
    this.props.notifyChange({ genId: selectedGen })
  }

  onTypeClicked (selectedTypes) {
    this.props.notifyChange({ types: selectedTypes })
    this.setState({ types: selectedTypes })
  }

  onToggleLeg () {
    let rarity = !this.state.rarity
    this.setState({ rarity: rarity })
    this.props.notifyChange({ rarity: rarity })
  }

  render () {
    const genButtons = Utils.generateGenButtons(this.state.selectedGen, this.onGenClicked.bind(this))
    const filterContainerCls = 'filters-container ' + (this.props.visible ? 'filters-container-open' : 'filters-container-closed')
    return (
      <div className={filterContainerCls}>
        <div id='gen-table-container' className='gen-table-container'>
          {genButtons}
          <div onClick={() => this.onToggleLeg()} className={'gen-button leg gen-button-right gen-button-left' + (this.state.rarity ? ' selected' : '')} />
        </div>
        <TypeFilter types={this.state.types} onTypeClicked={(list) => this.onTypeClicked(list)} />
      </div>
    )
  }
}

export default FilterPanel
