@if(Auth::check())
    <script type="text/javascript">
    window.Auth = {
        modules : {{Auth::user()->getAllModules()}},
        menu_top:{
            items: {{Auth::user()->getMenuTopItems()}},
            user: {{Auth::user()->menuTopInfosUser()}}
        },
        /**
         * Retourne true si l'utilisateur a le droit d'accès en lecture au module
         * correspondant à l'URL passée en paramètres (1er segment de l'URL seulement)
         *
         * @param url : 1er segment de l'url du module à tester
         */
        canAccess : function(url){
            var retour = false;
            // Test de la présence du module dans la liste pour le mode lecture
            _.each(this.modules, function(module,index,list){
                if(module.url == url){
                    retour = true;
                }
            }, this);
            return retour;
        },
        /**
         * Retourne true si l'utilisateur a le droit d'accès en modif au module
         * correspondant à l'URL passée en paramètres (1er segment de l'URL seulement)
         *
         * @param url : 1er segment de l'url du module à tester
         */
        canModif: function(url){
            var retour = false;
            // Test de la présence du module dans la liste ET de la valeur modif
            _.each(this.modules, function(module,index,list){
                if(module.url == url && module.access_level == 'modif'){
                    retour = true;
                }
            }, this);
            return retour;
        }
    };
    </script>
@endif