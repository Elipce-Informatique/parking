// Modules perso
// ATTENTION la majuscule est super importante
//var Table = require('./mods/react_table');
var DataTableBandeau = require('./mods/react_data_table_bandeau');
var Bandeau = require('./mods/react_bandeau');

$(function(){
    // Tableau
    var head = ['Nom','E-mail'];
    var hide = ['id'];
    var evts = {};
    
    var data = [
                {'id':'1','nom':'perez','prenom':'vivian'},
                {'id':'2','nom':'perez','prenom':'vivian'},
                {'id':'3','nom':'perez','prenom':'vivian'},
                {'id':'4','nom':'perez','prenom':'vivian'},
                {'id':'5','nom':'perez','prenom':'vivian'},
                {'id':'6','nom':'perez','prenom':'vivian'},
                {'id':'7','nom':'plt','prenom':'yann'}
            ];
    
    // Bandeau ATTENTION BANDEAU AVANT
     var oBandeau = React.render(
        <Bandeau titre={Lang.get('utilisateur.titre')}/>,
        document.getElementById('bandeau')
    );
    
    var oReactTable = React.render(
        <DataTableBandeau head={head} hide={hide} data={data} id="tab_users"/>,
        document.getElementById('tableau_react')
    );
    
    
    // Click bouton IIIII
    $('#test').click(function(){
       oReactTable.forceUpdate();
    });
});


var actionLoadDataUser = Reflux.createAction();
//
//// Creates a DataStore
//var userStore = Reflux.createStore({
//
//    // Initial setup
//    init: function() {
//
//        // Register statusUpdate action
//        this.listenTo(actionLoadDataUser, this.getData);
//    },
//
//    // Callback
//    getData: function() {
//        // AJAX
//        $.ajax({
//            url: BASE_URI+'utilisateur/all',
//            dataType: 'json',
//            context: this,
//            success: function(data) {
//                console.log("AAAAA"+'%o',data)
//                // Passe variable aux composants qui écoutent l'action actionLoadData
//                this.trigger(data);
//            },
//            error: function(xhr, status, err) {
//                 console.error(status, err.toString());
//                 this.trigger({});
//            }
//        });
//            
//    }
//
//});


////        console.log('TABLE didmount');
//        this.listenTo(this.props.actionData, function(data) {
////            console.log('listen %o',data);
//            this.setState({
//                data: data
//            });
//        });
//        this.props.actionData();