import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Species from 'components/Species'

class SpeciesTooltip extends React.Component {
   constructor() {
        super(...arguments)
    }


    buildStrengthWeaknessTr(id) {
        let rows = [];
        
        let data = PokedexHelper.getStrengthWeakness(id);
        let max = Math.max(data.strong.length, data.weak.length);
        for (let i = 0; i < max; i++) {

            rows.push(
                <tr>
                    { this.createAmountHtml(data.strong[i]) }
                    { this.createAmountHtml(data.weak[i]) }
                </tr>
            );
        }

        return rows;
    };

    createAmountHtml(amountData) {
        if (amountData) {
            return (<td align="center"><Species id={amountData.id}/></td>);
        }

        return null;
    }

    render() { 

        if (this.props.id !== -1) {
            let rows = this.buildStrengthWeaknessTr(this.props.id);
            let styles = { top: this.props.y, left: this.props.x };
            return (
                <div className="strength-table-container" tabIndex="-1" style={ styles }>
                    <table className="strength-table">
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default SpeciesTooltip; 