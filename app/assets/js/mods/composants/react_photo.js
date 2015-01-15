var Input = ReactB.Input;
var InputFile = require('./formulaire/react_form_fields').InputFile;
/**
 * Photo de protrait
 * @param src: URL de l'image
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var Photo = React.createClass({

    propTypes: {
        src: React.PropTypes.string.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        forceReload:React.PropTypes.bool
    },

    GetDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true,
            forceReload: false
        }
    },

    render: function () {
        var src = this.props.src;

        if(this.props.forceReload == true) {
            src = src + '?' + Date.now();
            console.log('Force photo reload');
        }

        return (
            <img src={src} {...this.props.attributes} {...this.props.evts} className="img-thumbnail img-responsive img-editable"/>
        )
    }
});
module.exports.Photo = Photo;

/**
 * Photo portrait editable
 * @param editable: (bool) Si true alors INPUT sinon LABEL
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PhotoEditable = React.createClass({

    propTypes: {
        editable: React.PropTypes.bool.isRequired,
        src: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        attributes: React.PropTypes.object,
        evts: React.PropTypes.object,
        alertOn: React.PropTypes.bool,
        gestMod: React.PropTypes.bool,
        forceReload:React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            alertOn: false,
            forceReload: false
        }
    },
    getInitialState: function () {
        return {src: this.props.src};
    },

    render: function () {

        console.log('src : %o', this.state.src);

        var retour;

        var photo = <Photo
                        src = {this.state.src}
                        attributes = {this.props.attributes}
                        evts = {this.props.evts}
                        forceReload = {this.props.forceReload}
                    />;
        // Editable
        if (this.props.editable) {
            var evts = {onChange: this.onChange};
            retour = <span>
                        {photo}
                        <InputFile
                            typeOfFile={'img'}
                            alertOn={this.props.alertOn}
                            gestMod={this.props.gestMod}
                            name={this.props.name}
                            libelle={Lang.get('global.modifier')}
                            evts={evts}
                            ref="InputPhoto" />
                    </span>
        }
        // Non editable
        else {
            retour = photo;
        }
        return retour;
    },

    onChange: function () {
        var input = $(this.refs.InputPhoto.getDOMNode()).find('input')[0];

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //this.setState({src: e.target.result});
            }.bind(this);

            reader.readAsDataURL(input.files[0]);
        }
    }
});
module.exports.PhotoEditable = PhotoEditable;