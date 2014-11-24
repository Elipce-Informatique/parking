// Creates a DataStore
var isEdtitableStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.tableLineClicked, this.output);
    },

    // Callback
    output: function(tr) {
        // Get ID
        var isEditable = $(tr).hasClass('row_selected');

        // Pass on to listeners
        this.trigger(isEditable);
    }

});

module.exports = isEdtitableStore;