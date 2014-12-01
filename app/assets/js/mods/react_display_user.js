/**
 * @param 
 */

var DisplayUser = React.createClass({
    
    propTypes: {
        head: React.PropTypes.array.isRequired
    },
    
    /**
     * Les props par défaut
     */
    getDefaultProps: function() {
        
        return {
            attributes: {},
            evts:{},
            bUnderline: true,
            data: []
        };
    },
    
    render: function() {       
        
        return (
         <h1 />
        )
    }
    
 /*
 |--------------------------------------------------------------------------
 | FONCTIONS NON REACT
 |--------------------------------------------------------------------------
 */
    
});

module.exports = DisplayUser;
