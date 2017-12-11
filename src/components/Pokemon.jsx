import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

class Pokemon extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    toSpecies(id) {
        let species = PokedexHelper.getTypes(id);
        let speciesName = PokedexHelper.loc(species);
        let speciesClassName = PokedexHelper.loc(species).toUpperCase();

        return (
            <div key={id} className={"type POKEMON_TYPE_" + speciesClassName}>{speciesName}</div>
        )
    }

    render() { 
        let pokemon = PokedexHelper.getPokemon(this.props.id);
        let name = PokedexHelper.loc(pokemon);
        var gen = pokemon.gen;
        var h2Class = ''; //(args.inactive) ? 'inactive-h2' : '';
        var valueClass = 'value'; //(args.inactive) ? 'inactive-value' : 'value';

        return (
            <div className="gen" data-id={this.props.id}>
                <a className="pokemon g1" href="#" data-gen={gen}>
                <h2 className={h2Class}>{name}</h2>
                    <div className="types">
                        {pokemon.species.map(this.toSpecies)}
                    </div>
                    <img className="lazimage" src={"https://www.serebii.net/art/th/" + this.props.id + ".png"} style={{ display: 'block' }}/>
                    <div className="bar">
                        <div className={valueClass}></div>
                    </div>
                    <div className="id">{this.props.id}</div>
                </a>
            </div>
        )
    }
}



/*
Engine.prototype.toHtml = function (pokemonId, args) {


    var speciesHtml = '';
    for (var i = 0; i < pokemon.species.length; i++) {
        speciesHtml += this.toSpeciesHtml(pokemon.species[i]);
    }

    var valueClass = (args.inactive) ? 'inactive-value' : 'value';
    var h2Class = (args.inactive) ? 'inactive-h2' : '';

    return '<div class="gen" data-id="' + pokemonId + '">' +
                '<a class="pokemon g1" href="#" data-gen="' + gen + '">' +
                '<h2 class="' + h2Class + '">' + name + '</h2>' +
                    '<div class="types">' +
                        speciesHtml +
                    '</div>' +
                    //'<img class="lazy" src="https://pokemon.gameinfo.io/images/thumbs/140/' + pokemonId + '.png" style="display: block;"/>' +

                        '<img class="lazimage" src="img/wait.gif" data-src="https://www.serebii.net/art/th/' + pokemonId + '.png" style="display: block;"/>' +
                    '<div class="bar">' +
                        '<div class="' + valueClass + '"></div>' +
                    '</div>' +
                    '<div class="id">' + pokemonId + '</div>' +
                '</a>' +
            '</div>';
};
*/
export default Pokemon
