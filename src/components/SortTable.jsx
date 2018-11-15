import React from 'react'
import Store from '../data/Store'
import './css/table.css'

class SortTable extends React.Component {
   constructor(props) {
        super(props)

        let sortIndex = -1, ascending = false
        props.columns.forEach((column, colIndex) => {
            if (column.default) {
                sortIndex = colIndex
            }
        })

        this.state = Store.get(SortTable.KEY, {
            sortIndex: sortIndex,
            ascending: ascending
        })
    }

    componentWillReceiveProps(args) {
        delete this.indices
    }
    /**
     * columns (array): 
     * value: String
     * align: left/right/center (left: default)
     * sortable: true/false (true: default)
     * default: true/false (false: default)
     * callback: custom renderer
     * type: string/number (string: default)
     */

    generateHeader() {
        let header = this.props.columns.map((column, colIndex) => {
            let clazz = colIndex === this.state.sortIndex ? 'sort-table-sort-th' : ''
            return <th align={ _align(column) } className={ clazz } onClick={ () => this.onSort(colIndex) }>{ column.text }</th>
        })

        return (<thead><tr>{ header }</tr></thead>)

    }

    /**
     * datas: array of array 
     */
    generateTable() {
        let rows = this.getIndices().map(rowIndex => {
            let cols = this.props.datas[rowIndex].map((value, colIndex) => {
                if (this.props.columns[colIndex].callback) {
                    value = this.props.columns[colIndex].callback(rowIndex, colIndex, value)
                }
                if (value === undefined) {
                    value = '-'
                }
                return <td align={ _align(this.props.columns[colIndex]) } /* className={ clazz } */>{ value }</td>
            });
            return <tr data-index={ rowIndex } onClick={(e) => this.onClick(e) }>{ cols }</tr>
        })
        return (<tbody>{ rows }</tbody>)
    }

    onClick(e) {
        let rowIndex = e.currentTarget.dataset.index
        this.props.onCellClicked(rowIndex)
    }

    onSort(index) {

        if (this.props.columns[index].sortable === false) {
            return; 
        }

        let ascending = this.state.ascending, sortIndex = this.state.sortIndex
        if (sortIndex === index) {
            ascending = !ascending
        } else {
            sortIndex = index
            ascending = false
        }

        this._sort(sortIndex, ascending)

        let state = { ascending: ascending, sortIndex: sortIndex }
        this.setState(state)
        Store.set(SortTable.KEY, state)
    }

    _sort(sortIndex, ascending) {
        this.getIndices().sort((a, b) => {
            let v0 = this.props.datas[a][sortIndex] || 0, v1 = this.props.datas[b][sortIndex] || 0
            if (v0 === undefined && v1 != undefined) {
                return 1
            }  else if (v0 === undefined && v1 !== undefined) {
                return -1
            }
            let res = (this.props.columns[sortIndex].type === 'number') ? v0 - v1 : v0.localeCompare(v1)
            return ascending ? res : -res
        })
    }

    render() { 
        
        return (
            <table ref='table' className='sort-table'>
                { this.generateHeader() }
                { this.generateTable() }
            </table>
        )
    }
    
    getIndices() {
        if (!this.indices) {
            this.indices = this.props.datas.map((_, index) => index)                            
            if (this.state.sortIndex !== -1) {
                this._sort(this.state.sortIndex, this.state.ascending)
            }
        }

        return this.indices;
    }
}

function _align(column) {
    switch (column.align) {
        case 'right': return 'right'
        case 'left': return 'left'
    }
    return 'center'
}

SortTable.KEY = 'sort-table'
export default SortTable; 