// Modules perso
// ATTENTION la majuscule est super importante
//var Table = require('./mods/react_table');
var DataTable = require('./mods/react_data_table');
var Bandeau = require('./mods/react_bandeau');
var actionLoadDataUser = Reflux.createAction();

$(function(){
    // Tableau
    var head = ['Nom','E-mail'];
    var hide = ['id'];
    var evts = {};
    
    var oReactTable = React.render(
        <DataTable head={head} hide={hide} id="tab_users" actionData={actionLoadDataUser}/>,
        document.getElementById('tableau_react')
    );
    
    // Bandeau
     var oBandeau = React.render(
        <Bandeau titre={Lang.get('utilisateur.titre')}/>,
        document.getElementById('bandeau')
    );
    
    // Click bouton IIIII
    $('#test').click(function(){
       oReactTable.forceUpdate();
    });
});


// Creates a DataStore
var userStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(actionLoadDataUser, this.getData);
    },

    // Callback
    getData: function() {
        // AJAX
        $.ajax({
            url: BASE_URI+'utilisateur/all',
            dataType: 'json',
            context: this,
            success: function(data) {
                console.log("AAAAA"+'%o',data)
                // Passe variable aux composants qui écoutent l'action actionLoadData
                this.trigger(data);
            },
            error: function(xhr, status, err) {
                 console.error(status, err.toString());
                 this.trigger({});
            }
        });
            
    }

});