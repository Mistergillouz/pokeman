import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'

export default class Utils {

    static generateGenButtons(selected, onClickCallback) {
        let genButtons = [];

        for (let i = 1; i <= Constants.MAX_GEN; i++) {

            let clazz = (i === 1) ? 'gen-button-left' : (i === Constants.MAX_GEN) ? 'gen-button-right' : 'gen-button-center';
            if (Utils.arrayfy(selected).indexOf(i) !== -1) {
                clazz += ' selected';
            }

            genButtons.push(
                <label key={ i }
                    className={ "gen-button " + clazz } 
                    onClick={(e) => { onClickCallback(i) }}>
                    {i}
                </label>);
        }

        return genButtons
    }

    static toggle(array, value, isMono) {
        let  index = array.indexOf(value), copy
        if (!isMono) {
            copy = array.slice()
            if (index !== -1) {
                copy.splice(index, 1);
            } else {
                copy.push(value);
            }

        } else if (index !== -1) {
            copy = [];
        } else {
            copy = [ value ];
        }

        return copy
    }

    static arrayfy(a) {
        return a.length === undefined ? [a] : a
    }

    
    static normalizeText(text) {
        
        const subs = [
            [ 'é', 'e' ],
            [ 'è', 'e' ],
            [ 'ê', 'e' ],
            [ 'ë', 'e' ],
            [ 'à', 'a' ],
            [ 'â', 'a' ],
            [ 'ä', 'a' ]
        ];
        
        let string = text = text.trim().toLowerCase();
        for (let sub of subs) {
            string = Utils.replaceAll(string, sub[0], sub[1]);
        }
    
        return string;
    }

    
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    
    static round(num, decimals) {
        var n = Math.pow(10, decimals);
        return Math.round( (n * num).toFixed(decimals) )  / n;
    }

    static match(str, rule) {
        let regex = new RegExp("^" + rule.split("*").join(".*") + "$")
        return regex.test(str) || str.indexOf(rule) !== -1
    }
}