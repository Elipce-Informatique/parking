// ATTENTION la majuscule est super importante
var DataTableBandeauUser = require('./mods/react_data_table_bandeau_utilisateur');
var Bandeau = require('./mods/react_bandeau');

$(function(){
    
    // Tableau
    var head = ['Nom','E-mail'];
    var hide = ['id'];
    var evts = {'click':function(){alert("toto")}};
    
    // Bandeau ATTENTION BANDEAU AVANT à cause du fixed header du tableau
     var oBandeau = React.render(
        <Bandeau titre={Lang.get('utilisateur.titre')}/>,
        document.getElementById('bandeau')
    );
    
    var oReactTable = React.render(
        <DataTableBandeauUser head={head} hide={hide} id="tab_users" evts={evts}/>,
        document.getElementById('tableau_react')
    );
    
    
    // Click bouton IIIII
    $('#test').click(function(){
       oReactTable.forceUpdate();
    });
});

