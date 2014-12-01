
var AuthentLevelMixin = {
    componentWillMount: function() {
        // TODO :
        if(!Auth.check()) {
            // Disable component
            this.render = function () {
                return false;
            }
        }
    }
}

module.exports = AuthentLevelMixin;