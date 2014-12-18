/**
 * Created by yann on 17/12/2014.
 */
var mixinGestionModif = {
    componentDidMount: function () {
        this.attachEventsOnForm();
    },
    componentDidUpdate: function (pp, ps) {
        this.attachEventsOnForm();
    },
    attachEventsOnForm: function () {
        //console.log(this.getDOMNode());
        var $form = $(this.getDOMNode());
        $form.off(Actions.global.gestion_modif_change, '[data-gest-mod]');
    }
};

module.exports = mixinGestionModif;