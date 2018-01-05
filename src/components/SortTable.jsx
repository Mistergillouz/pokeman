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
     */

    generateHeader() {
        let header = this.props.columns.map((column, colIndex) => {
            let clazz = ''
            if (colIndex === this.state.sortIndex) {
                clazz =  'sort-table-sort'
            }
            return <th align={ _align(column) } className={ clazz }>{ column.text }</th>
        })

        return (<thead><tr>{ header }</tr></thead>)

    }

    /**
     * datas: array of array 
     */
    generateTable() {
        let rows = this.props.datas.map((row, rowIndex) => {
            let cols = row.map((value, colIndex) => {
                return <td align={ _align(this.props.columns[colIndex]) }>{ value }</td>
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
            ascending = true
        }

        this.props.datas.sort((a, b) => {
            let v0 = a[sortIndex], v1 = b[sortIndex]
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
}

function _align(column) {
    switch (column.align) {
        case 'right': return 'right'
        case 'center': return 'center'
    }
    return 'left'
}

export default SortTable; 