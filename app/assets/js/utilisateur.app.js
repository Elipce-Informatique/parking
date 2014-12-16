// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('./mods/react_data_table_bandeau_utilisateur');
var Bandeau = require('./mods/composants/bandeau/react_bandeau');
var Button = ReactB.Button;
var FicheUser = require('./mods/react_fiche_utilisateur');
var containerTableau = 'tableau_react';

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
        document.getElementById(containerTableau)
    );
});

/**
 * Affaiche la fiche utilisateur
 * @param evt: evenement JS
 */
function displayUser(evt){
    var tr = $(evt.currentTarget);
    var id = tr.data('id');

    React.unmountComponentAtNode(document.getElementById(containerTableau));

    var oReactTable = React.render(
        <FicheUser editable={true} idUser={id} />,
        document.getElementById(containerTableau)
    );

}

function onCreerBandeau(e){
    console.log('OnCréer bandeau clické: ');
    console.log(e);
}