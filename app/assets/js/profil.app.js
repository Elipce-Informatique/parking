var Bandeau = require('./mods/react_bandeau');

$(function(){
    var oBandeau = React.render(
        <Bandeau titre={Lang.get('profil.titre')}/>,
        document.getElementById('bandeau')
    );
});