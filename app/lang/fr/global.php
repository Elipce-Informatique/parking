<?php
return array(

    /*
    |--------------------------------------------------------------------------
    | Global Language Lines
    |--------------------------------------------------------------------------
    */

    // NOM DE L'APPLI
    'app_name' => 'Parking',

    // MENU TOP
    'toggle_menu_left' => 'Menu de gauche',

    // GÉNÉRALITÉS BANDEAU
    'edit' => 'Editer',
    'create' => 'Créer',
    'del' => 'Supprimer',
    'creation' => 'Création',
    'edition' => 'Edition',

    // BOITES DE DIALOGUES
    'suppression_titre' => 'Êtes-vous sur?',
    'suppression_corps' => 'La suppression est une action irréversible.',
    'suppression_capteur_corps' => 'La suppression d\'un capteur virtuel entrainera la suppression de tous les capteurs ayant un numéro physique supérieur.',

    // CHARGEMENT
    'block_ui' => 'Chargement....',

    // GESTION MODIFS
    'gest_mod_confirm' => 'Des modifications non enregistrées on été effectuées.',
    'gest_mod_confirm_question' => 'Des modifications non enregistrées on été effectuées.
Voulez-vous vraiment quitter cette page ?',

    // NOTIFICATIONS
    'notif_success' => 'Opération effectuée avec succès !',
    'notif_warning' => 'Message de danger générique',
    'notif_erreur' => 'Une erreur s\'est produite, veuillez contacter un responsable informatique',
    'notif_default' => 'Message d\'information générique',
    'notif_erreur_upload' => 'Erreur de téléchargement du fichier',

    // CHARGEMENT
    'block_ui' => 'Chargement....',

    // VALIDATIONS
    'validation_success_generique' => '',
    'validation_warning_generique' => 'Attention à la valeur de ce champ',
    'validation_erreur_generique' => 'Ce champ est mal rempli.',
    'validation_default_generique' => '',
    'validation_erreur_pass' => 'Le mot de passe doit faire 6 caractères de long et contenir des chiffres et des lettres',
    'validation_erreur_mail' => 'L\'e-mail saisi n\'est pas valide',
    'validation_erreur_date' => 'Format de date incorrect (JJ/MM/AA)',
    'validation_erreur_time' => 'Format incorrect (HH:MM:SS)',
    'form_incorrect' => 'Formulaire invalide',
    'champ_obligatoire' => 'Champ obligatoire',
    'validation_erreur_ip' => "L'adresse IP saisie n'est pas valide XXX.XXX.XXX.XXX",


    // BOUTONS
    'save' => "Sauvegarder",
    'back' => 'Retour',

    // AUTHENTIFICATION
    'title_bienvenue' => 'Connectez-vous',
    'email' => 'Email',
    'password' => 'Mot de passe',
    'remember' => "Se rappeller de moi",
    'login' => 'Connexion',
    'logout' => 'Déconnexion',
    'login_error' => "Erreur lors de la tentative de connexion. L'e-mail et le mot de passe fournis ne correspondent pas.",
    'password_oublie' => "Mot de passe oublié ?",

    // PROFIL
    'profils' => 'Profils',
    'profil' => 'Profil',
    'droits' => 'Droits',
    'utilisateurExist' => 'Cet utilisateur existe déjà',

    // AUTRES
    'accueil' => 'Accueil',
    'administration' => 'Administration',
    'acceder' => 'Accéder',
    'gerer' => 'Gérer',
    'ok' => 'Ok',
    'oui' => 'Oui',
    'non' => 'Non',
    'annuler' => 'Annuler',
    'annule' => 'Annulé',
    'modifier' => 'Modifier',
    'attention' => 'Attention',
    'libelle' => 'Libelle',
    'selection' => 'Sélection',
    'nom' => 'Nom',
    'description' => 'Description',
    'defaut' => 'Défaut',
    'message' => "Message",
    'reset' => 'Reset',
    'etat_reseau' => "Communication",

    // FORMULAIRE
    'select' => 'Sélection...',
    'saisieNumber' => 'Veuillez saisir un nombre',
    'saisieNumberBis' => ' entre %1 et %2',
    'inputTelError' => 'Numéro incorrect',
    'erreurFileInput' => "Seules les extensions suivantes sont prises en compte :\n [extensions]",
    'associer' => 'Associer',

    // PARKING
    'occupee' => 'Occupée',
    'libre' => 'Libre',
    'parking' => 'Parking',
    'niveau' => 'Niveau',
    'plan' => 'Plan',
    'place' => 'Place',
    'concentrateur' => 'Concentrateur',
    'bus' => 'Bus',
    'capteur' => 'Capteur',
    'adresse' => 'Adresse',
    'afficheur' => 'Afficheur',
    'ip' => "Adresse IP",
    'v4id' => "ID réseau terrain",
    'bonne' => 'Bonne place',
    'type_place' => 'Type de place',
    'empty' => 'Libre',
    'full' => 'Complet',
    'leg' => 'Leg',
    'virtuel' => 'Virtuel',
    'config' => 'Configuration',
    'logo' => "Logo",
    'telecharger' => "Télécharger",

    // ALERTES
    'alerte_full' => "",
    'alerte_empty' => "",

    /*
    |--------------------------------------------------------------------------
    | Traduction DataTables
    |--------------------------------------------------------------------------
    */
    'datatable' => [
        'sProcessing' => 'Traitement en cours...',
        'sSearch' => 'Rechercher',
        'sLengthMenu' => 'Afficher _MENU_ &eacute;l&eacute;ments',
        'sInfo' => "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        'sInfoEmpty' => "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        'sInfoFiltered' => '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
        'sInfoPostFix' => '',
        'sLoadingRecords' => 'Chargement en cours...',
        'sZeroRecords' => 'Aucun &eacute;l&eacute;ment &agrave; afficher',
        'sEmptyTable' => 'Aucune donn&eacute;e disponible dans le tableau',
        'oPaginate' => [
            'sFirst' => 'Premier',
            'sPrevious' => 'Pr&eacute;c&eacute;dent',
            'sNext' => 'Suivant',
            'sLast' => 'Dernier'
        ],
        'oAria' => [
            'sSortAscending' => '=> activer pour trier la colonne par ordre croissant',
            'sSortDescending' => '=> activer pour trier la colonne par ordre d&eacute;croissant'
        ]
    ],


    'com' => [
        'errConnServer' => 'Erreur de connexion au serveur de communication'
    ]
);
