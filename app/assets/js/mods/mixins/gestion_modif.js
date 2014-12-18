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
        var $page = $(this.getDOMNode());
        $page.off("change", '[data-gest-mod]', Actions.global.gestion_modif_change);
        $page.on("change", '[data-gest-mod]', Actions.global.gestion_modif_change);
    }
};

module.exports = mixinGestionModif;