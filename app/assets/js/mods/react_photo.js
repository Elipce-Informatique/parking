/**
 * Photo de protrait
 * @param src: URL de l'image
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var Photo = React.createClass({

    propTypes: {
        src: React.PropTypes.string.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object
    },

    GetDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
       return(
           <img src={this.props.src} {...this.props.attributes} {...this.props.evts} className="img-thumbnail img-responsive img-editable"/>
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
        editable:React.PropTypes.bool.isRequired,
        src:React.PropTypes.string.isRequired,
        attributes:React.PropTypes.object,
        evts:React.PropTypes.object
    },

    GetDefaultProps: function(){
        return{
            attributes: {},
            evts: {}
        }
    },

    render: function() {
        var retour;
        // Editable
        if(this.props.editable){
            retour =  <Photo
                            src={this.props.src}
                            attributes = {this.props.attributes}
                            evts = {this.props.evts}
                        />
        }
        // Non editable
        else{
            retour = <img src={this.props.src} className="img-thumbnail img-responsive"/>;
        }
        return retour;
    }
});
module.exports.PhotoEditable = PhotoEditable;