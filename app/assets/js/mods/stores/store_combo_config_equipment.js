/**
 * Created by yann on 30/09/2015.
 *
 * Le name de la combo est important, il doit être donné via le store:
 * Trigger un objet prêt à être donné à une combo:
 * {
 *      listConfigs: [{value:,label:}...],
 *      configs_ids: [],
 *      combo_config_name: 'configs_ids'
 * }
 */
module.exports = Reflux.createStore({

    localState: {},

    getInitialState: function () {
        this.initLocalState();
        this.fetchData();
        return this.localState;
    },

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.validation.form_field_changed, this.updateForm);
        this.initLocalState();
    },

    initLocalState: function () {
        this.localState = {
            listConfigs: [],
            configs_ids: [],
            combo_config_name: 'configs_ids'
        }
    },

    updateForm: function (data) {
        switch (data.name) {
            // Concentrateur selected
            case 'configs_ids':
                this.localState.configs_ids = data.value.split('[-]');
                this.trigger(this.localState);
                break;
        }
    },

    fetchData: function () {
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/config_equipement/combo_all',
            processData: false,
            contentType: false,
            context: this
        })
            .done(function (data) {
                if (data.length) {
                    this.localState.listConfigs = data;
                    this.trigger(this.localState);
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    }
});
