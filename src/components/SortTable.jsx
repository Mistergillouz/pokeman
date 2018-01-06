import React from 'react'
import '../../assets/styles/table.css'

class SortTable extends React.Component {
   constructor() {
        super(...arguments)
        this.state = {
            sortIndex: -1,
            ascending: false
        }
    }

    /**
     * columns (array): 
     * text: String
     * align: left/right/center (left: default)
     * sortable: true/false (true: default)
     * callback: custom renderer
     */

    generateHeader() {
        let header = this.props.columns.map((column, colIndex) => {
            let clazz = colIndex === this.state.sortIndex ? 'sort-table-sort-th' : ''
            return <th align={ _align(column) } className={ clazz }>{ column.text }</th>
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
                    value = this.props.columns[colIndex].callback(rowIndex, colIndex)
                }
                let clazz = colIndex === this.state.sortIndex ? 'sort-table-sort-td' : ''
                return <td align={ _align(this.props.columns[colIndex]) } className={ clazz }>{ value }</td>
            });
            return <tr>{ cols }</tr>
        })

        return (<tbody>{ rows }</tbody>)
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

        this.getIndices().sort((a, b) => {
            let v0 = this.props.datas[a][sortIndex], v1 = this.props.datas[b][sortIndex]
            let res = (typeof v0 === 'number') ? v0 - v1 : v0.localeCompare(v1)
            return ascending ? res : -res
        })

        this.setState({ ascending: ascending, sortIndex: sortIndex })
    }

    componentDidMount() {
        var cells = this.refs.table.getElementsByTagName('th')
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', () => this.onSort(i))
        }

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

export default SortTable; 