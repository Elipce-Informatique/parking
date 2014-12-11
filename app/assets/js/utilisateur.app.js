// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('./mods/react_data_table_bandeau_utilisateur');
var Bandeau = require('./mods/composants/react_bandeau');
var Button = ReactB.Button;
var InputTextEditable = require('./mods/composants/formulaire/react_input.js');

$(function(){
    
    // Tableau
    var head = [Lang.get('administration.utilisateur.tableau.nom'),Lang.get('administration.utilisateur.tableau.email'),Lang.get('administration.utilisateur.tableau.email2'),Lang.get('administration.utilisateur.tableau.email3')];
    var hide = ['id'];
    var evts = {'onClick':displayUser};
    
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

function displayUser(evt){
    var tr = $(evt.currentTarget);
    var id = tr.data('id');
    var attr = {value:id};

    var oReactTable = React.render(
        <InputTextEditable attributes={attr} editable={false} />,
        document.getElementById('tableau_react')
    );

    // suppression fixed header => voir sur unset du tableau react
    $('.fixedHeader').remove();
}