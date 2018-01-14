import React from 'react'
import ReactDOM from 'react-dom';
import PokedexHelper from 'data/PokedexHelper'
import Species from 'components/Species'
import Constants from 'data/Constants'

class SpeciesTooltip extends React.Component {
   constructor() {
        super(...arguments)
    }


    buildStrengthWeaknessTr(id) {
        let rows = [];
        
        let [damageStrengths, _] = PokedexHelper.getDamageStrengthWeakness(id)
        let strength = [], weak = []
        Object.keys(damageStrengths).forEach(id => {
            let percent = damageStrengths[id]
            if (percent > 100) {
                strength.push(id)
            } else if (percent < 100) {
                weak.push(id)
            }
        })

        for (let i = 0; i < Math.max(strength.length, weak.length); i++) {
            rows.push(
                <tr>
                    { this.createAmountHtml(strength[i], damageStrengths[strength[i]]) }
                    { this.createAmountHtml(weak[i], damageStrengths[weak[i]]) }
                </tr>
            )
        }

        return rows;
    };

    createAmountHtml(id, percent) {
        if (id) {
            return (<td align="center"><Species id={ id }/></td>);
        }

        return <td></td>
    }

    onBlur() {
        this.props.eventHandler({
            eventType: Constants.EVENT.HideTooltip
        });
    }

    componentDidUpdate() {
        if (this.props.visible) {
            // Reposition tooltip within screen

            let node = ReactDOM.findDOMNode(this);
            let px = this.props.args.x + 5, py = this.props.args.y + 10;
            let ttw = node.scrollWidth, tth = node.scrollHeight;
            let scw = document.body.clientWidth - 20, sch = document.documentElement.clientHeight - 20;
            let x = ((px + ttw) > scw) ? scw - ttw : px, y = ((py + tth) > sch) ? sch - tth : py;
            node.style.top = y + 'px';
            node.style.left = x + 'px';

            node.focus();
        }
    }

    render() { 

        if (!this.props.visible) {
            return null
        }

        let id = this.props.args.id;
        if (id !== -1) {
            let rows = this.buildStrengthWeaknessTr(id);
            return (
                <div className="strength-table-container" tabIndex="-1" onBlur={() => this.onBlur() } onClick={ () => this.onBlur() }>
                    <table className="strength-table">
                        <thead><tr><th>Fort vs</th><th>Faible vs</th></tr></thead>
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