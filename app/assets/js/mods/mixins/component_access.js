/**
 * Utilise la propriété this.props.module_url pour identifier le module
 *
 */
var AuthentLevelMixin = {
    componentWillMount: function () {
        // TEST EXISTANCE MODULE URL
        if (typeof(this.props.module_url) == "undefined") {
            console.warn('Attention, l\'utilisation du mixin "component_access" dans le composant "' +
            this._currentElement.type.displayName +
            '" requiert que la propriété module_url soit renseignée pour gérer les droits d\'accès au module.');
        } else {
            this._originalRender = this.render;
            this._setRenderMethod(this.props);
            this._setVisuState(this.props);
        }
    },
    componentWillUpdate: function (np, ns) {
        // TEST EXISTANCE MODULE URL
        if (typeof(this.props.module_url) == "undefined") {
            console.warn('Attention, l\'utilisation du mixin "component_access" dans le composant "' +
            this._currentElement.type.displayName +
            '" requiert que la propriété module_url soit renseignée pour gérer les droits d\'accès au module.');
        } else {
            this._setRenderMethod(np);
        }
    },
    componentWillReceiveProps: function(np) {
        // TEST EXISTANCE MODULE URL
        if (typeof(np.module_url) == "undefined") {
            console.warn('Attention, l\'utilisation du mixin "component_access" dans le composant "' +
            this._currentElement.type.displayName +
            '" requiert que la propriété module_url soit renseignée pour gérer les droits d\'accès au module.');
        } else {
            this._setVisuState(np);
        }
    },
    _emptyRender: function () {
        return <span />;
    },
    _setRenderMethod: function (props) {
        this.render = Auth.canAccess(props.module_url) ? this._originalRender : this._emptyRender;
    },
    _setVisuState: function (props) {
        this.setState({_canModif: Auth.canModif(props.module_url)});
    }
};

module.exports = AuthentLevelMixin;