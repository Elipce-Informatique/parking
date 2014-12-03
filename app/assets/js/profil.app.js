var Bandeau = require('./mods/react_bandeau');

$(function(){
    var oBandeau = React.render(
        <Bandeau titre={Lang.get('administration.profil.titre')}/>,
        document.getElementById('bandeau')
    );
});