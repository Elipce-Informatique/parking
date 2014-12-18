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
        $page.off("change", '[data-gest-mod]', this.triggerChange);
        $page.on("change", '[data-gest-mod]', this.triggerChange);
    },
    triggerChange: function(){
        console.log('testqsdf');
    }
};

module.exports = mixinGestionModif;