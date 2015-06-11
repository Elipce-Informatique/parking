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
        return {
            src: this.props.src,
            srcApresUpload: ''
        };
    },

    /**
     * Update state seulement si src a changé.
     * @param np
     * @param ns
     * @returns {boolean}
     */
    shouldComponentUpdate: function (np, ns) {
        return true;
    },

    componentWillReceiveProps: function (np) {
        this.setState({
            src: np.src
        });
    },

    onChange: function (e) {
        var input = $(this.refs.InputPhoto.getDOMNode()).find('input')[0];

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                this.setState({
                    srcApresUpload: e.target.result
                });
            }.bind(this);

            reader.readAsDataURL(input.files[0]);
        }
        // OnChage custom du dev
        if(this.props.evts.onChange !== undefined){
            this.props.evts.onChange(_.cloneDeep(e));
        }
    },

    render: function () {

        var src = '';

        // L'utilisateur a chargé une image
        if(this.state.srcApresUpload != ''){
            src = this.state.srcApresUpload;
        }
        // L'image est une image existantesur le serveur
        else{
            src = this.state.src;
            // Image pas en cache
            if (!this.props.cacheable) {
                src += "?t=" + new Date().getMilliseconds();
            }
        }

        var retour;
        // EDITABLE
        if (this.props.editable) {
            var evts = {
                onChange: this.onChange
            };
            retour = (
                <Photo
                    src={src}
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
                    src = {src}
                    attributes = {this.props.attributes}
                    evts = {this.props.evts}
                />
            );
        }
        return retour;
    }
});
module.exports.PhotoEditable = PhotoEditable;