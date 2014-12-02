/**
 * Utilise la propriété this.props.module_url pour identifier le module
 *
 */
var AuthentLevelMixin = {
    componentWillMount: function () {
        this._originalRender = this.render;
        this._setRenderMethod();
    },
    componentWillUpdate: function () {
        this._setRenderMethod();
    },
    _emptyRender: function () {
        return <span />;
    },
    _setRenderMethod: function () {
        this.render = Auth.canAccess(this.props.module_url) ? this._originalRender : this._emptyRender;
    }
}

module.exports = AuthentLevelMixin;