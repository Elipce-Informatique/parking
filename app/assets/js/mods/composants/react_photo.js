var React = require('react/addons');
var Thumbnail = ReactB.Thumbnail;
var Col = ReactB.Col;
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
        evts: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            gestMod: true
        }
    },

    render: function () {

        return (
            <Thumbnail
                src={this.props.src}
                {...this.props.attributes}
                {...this.props.evts}>
            {this.props.children}
            </Thumbnail>

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
        cacheable: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            attributes: {},
            evts: {},
            alertOn: false,
            cacheable: false
        }
    },
    getInitialState: function () {
        var state = {};
        if (this.props.cacheable) {
            state = {src: this.props.src};
        } else {
            var date = new Date();
            state = {src: this.props.src + "?t=" + date.getMilliseconds()};
        }
        return state;
    },

    shouldComponentUpdate: function(){
        return true;
    },


    componentWillReceiveProps: function (np) {

        if (np.cacheable) {
            this.setState({src: np.src});
        } else {
            var date = new Date();
            this.setState({src: np.src + "?t=" + date.getMilliseconds()});
        }
    },

    onChange: function () {
        var input = $(this.refs.InputPhoto.getDOMNode()).find('input')[0];

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                this.setState({src: e.target.result});
            }.bind(this);

            reader.readAsDataURL(input.files[0]);
        }
        // Envoie du change
    },

    render: function () {

        var retour;
        // EDITABLE
        if (this.props.editable) {
            var evts = {
                onChange: this.onChange
            };
            retour = (
                <Photo
                    src={this.state.src}
                {...this.props.attributes}
                {...this.props.evts}>
                    <InputFile
                        typeOfFile={'img'}
                        alertOn={this.props.alertOn}
                        gestMod={this.props.gestMod}
                        name={this.props.name}
                        libelle={Lang.get('global.modifier')}
                        evts={evts}
                        ref="InputPhoto" />
                </Photo>
            );
        }
        // NON EDITABLE
        else {
            retour = (
                <Photo
                    src = {this.state.src}
                    attributes = {this.props.attributes}
                    evts = {this.props.evts}
                />
            );
        }
        return retour;
    }
});
module.exports.PhotoEditable = PhotoEditable;