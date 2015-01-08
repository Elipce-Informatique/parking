/**
 * @param 
 */

var DisplayUser = React.createClass({
    
    propTypes: {
        infos: React.PropTypes.object.isRequired
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {infos: {nom:'', prenom:''}};
    },
    
    render: function() {       
        
        return <div>
                    <img src={this.props.infos.photo} className="img-responsive img-thumbnail" alt={this.props.infos.nom+' '+this.props.infos.prenom}/>
                    <h2>{this.props.infos.nom} {this.props.infos.prenom}<h2>
                    <div className="row">qsdqd
                        <label className="col-md-2 text-right">{this.props.infos.nom}</label>
                    </div>
                </div>;
    }
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    
});

module.exports = DisplayUser;
