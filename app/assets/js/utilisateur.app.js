// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('./mods/react_data_table_bandeau_utilisateur');
var Bandeau = require('./mods/react_bandeau');
var Button = ReactB.Button;

$(function(){
    
    // Tableau
    var head = [Lang.get('administration.utilisateur.tableau.nom'),Lang.get('administration.utilisateur.tableau.email'),Lang.get('administration.utilisateur.tableau.email2'),Lang.get('administration.utilisateur.tableau.email3')];
    var hide = ['id'];
    var evts = {'onClick':Actions.utilisateur.display_user()};
    
    // Bandeau ATTENTION BANDEAU AVANT à cause du fixed header du tableau
     var oBandeau = React.render(
        <Bandeau titre={Lang.get('administration.utilisateur.titre')}/>,
        document.getElementById('bandeau')
    );

    var oReactTable = React.render(
        <DataTableBandeauUser head={head} hide={hide} id="tab_users" evts={evts}/>,
        document.getElementById('tableau_react')
    );
    
    
    
    
    
    
    
    // Click bouton IIIII
    $('#test').click(function(){
//       oReactTable.forceUpdate();
         Actions.utilisateur.load_data();
    });
});

