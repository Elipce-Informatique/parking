// Creates a DataStore
var isEdtitableStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.global.table_bandeau_line_clicked, this.outputTable);
    },

    // Callback
    outputTable: function(e) {
        // TR
        var tr = e.currentTarget;
        // Get ID
        var isEditable = $(tr).hasClass('row_selected');

        // Pass on to listeners
        this.trigger(isEditable);
    }

});

module.exports = isEdtitableStore;