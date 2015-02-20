require('./global/global');
var PageUser = require('./mods/page/react_page_compte').Composant;

$(function () {
    // Récupération des infos de l'utilisateur via le champ #user_data
    var userInfos = JSON.parse($('#user_data').val());
    var idUser = userInfos.id;

    // Création de la fiche utilisateur.

    var oReactPageUser = React.render(
        <PageUser idUser={idUser} dataUser={userInfos} />,
        document.getElementById('content_user')
    );
});