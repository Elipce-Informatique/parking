<?php
return array(

    /*
    |--------------------------------------------------------------------------
    | TEXTES DE LA PAGE D'ADMINISTRATION PARKING
    |--------------------------------------------------------------------------
    */
    'accueil' => [
        'texte' => 'La section d\'administration du parking permet de gérer et de configurer les différents éléments du parking'
    ],

    // MODULE ETAT D'OCCUPATION
    'etats_d_occupation' => [
        'texte' => 'Administration des états d\'une place. Permet de définir la couleur, le libelle, son état et son type.',
        'tableau' => [
            'couleur' => 'Couleur',
            'type_place' => 'Type de place',
            'etat_place' => 'Etat de la place',
            'logo' => 'Logo'
        ],
        'libelleExist' => 'Cet état d\'occupation existe déjà.',
        'etat_place' => 'Place occupée',
        'type_place' => 'Type place',
        'errorExist' => 'Cet état d\'occupation existe déjà.'
    ],
    // MODULE ETAT D'OCCUPATION
    'configuration_parking' => [
        'texte' => 'Configuration de la topologie d\'un parking: Création de niveaux, de zones, d\'allées et de places. Association des places avec des capteurs etc...'
    ],
    // MODULE CARTE
    'carte' => [
        'erreur_polygon' => 'Les lignes d\'un polygon ne peuvent pas se croiser',
        'titre_places_multiples' => 'Configuration de la série de places',
        'titre_afficheur' => 'Localisation d\'un afficheur',
        'titre_calibre' => 'Configuration du calibre',
        'titre_capteur' => 'Capteurs de place',
        'titre_zone' => 'Création d\'une zone',
        'titre_allee' => 'Création d\'une allée',
        'titre_edit_place' => "Édition d'une place",
        'titre_edit_allee' => "Édition d'une allee",
        'titre_edit_zone' => "Édition d'une zone",
        'titre_edit_afficheur' => "Édition d'une afficheur",
        'ajouter_place' => 'Ajouter une place',
        'ajouter_place_auto' => 'Ajouter une série de places',
        'ajouter_allee' => 'Ajouter une allée',
        'ajouter_zone' => 'Ajouter une zone',
        'ajouter_afficheur' => 'Ajouter un afficheur',
        'calibrer' => 'Calibrer le plan',
        'capteur_place' => 'Capteur de place',
        'nb_places' => 'Nombre de places',
        'intervalle_poteaux' => 'Espacement poteaux (nb places)',
        'largeur_poteaux' => 'Largeur des poteaux (cm)',
        'pref' => 'Pref.',
        'num_initial' => 'Num.',
        'suff' => 'Suff.',
        'incr' => 'Inc.',
        'field_calibre' => 'Longueur (cm)',
        '3_points_seulement' => 'Merci de tracer exactement 3 points !',
        'swal_interval_incorrect' => 'L\'intervalle entre les poteaux est incorrect, il doit être inférieur au nombre de places saisi.',
        'swal_calibre_points_ko' => 'Merci de tracer deux points uniquement.',
        'swal_calibre_non_init_titre' => 'Plan non calibré',
        'swal_calibre_non_init' => 'Ce plan n\'a pas encore été calibré. Pour le calibrer, veuillez utiliser l\'outil suivant : <br /><i class="fa fa-arrows"></i>',
        'swal_capteur_bus_finie' => 'Plus de capteur à affecter sur ce bus ! Veuillez sélectionner un autre bus pour continuer l\'affectation.',
        'place_deja_affectee' => 'Erreur: Place déjà affectée à un capteur.',
        'insert_places_fail' => 'Une erreur s\'est produite, aucune place n\'a été enregistrée.',
        'modif_places_fail' => 'Une erreur s\'est produite, aucune place n\'a été modifié.',
        'calibre_update_fail' => 'Une erreur s\'est produite, le calibre n\'a pas été mis à jour.',
        'selection_plan' => 'Veuillez sélectionner un plan à configurer dans le menu de gauche.',
        'err_zone_contenue' => 'Erreur : La zone dessinée ne doit ni contenir ni être contenue dans une autre zone.',
        'err_zone_chevauche' => 'Erreur : La zone dessinée coupe une autre zone.',
        'err_allee_chevauche' => 'Erreur : La zone dessinée coupe une allée.',
        'err_allee_chevauche_zone' => 'Erreur : L\'allée dessinée coupe une zone.',
        'err_zone_contenue_allee' => 'Erreur : La zone dessinée ne doit pas être contenue dans une allée.',
        'err_allee_contenue_allee' => 'Erreur : La zone dessinée ne doit pas être contenue dans une autre allée.',
        'err_parking_non_init' => 'Erreur : Le parking n\'a pas encore été initialisé.',
        // MESSAGE D'INFOS CAPTEUR (Cadre bas droite map)
        'infos_capteur_titre' => 'Capteur de place',
        'infos_capteur_adresse' => 'Adresse : ',
        'infos_capteur_restant' => 'Capteurs restant sur le bus : ',
        'infos_capteur_bouton' => 'Terminer l\'affectation',
        'swal_titre_confirm' => "Êtes-vous sûr ?",
        'swal_msg_confirm_zone' => "ATTENTION supprimer une zone est une action irréversible.",
        'swal_msg_confirm_allee' => "ATTENTION supprimer une allée est une action irréversible.",
        'swal_msg_confirm_place' => "ATTENTION supprimer une place est une action irréversible.",
        'swal_msg_confirm_afficheur' => "ATTENTION supprimer un afficheur est une action irréversible.",

    ],

    // MODULE TEMPS REEL
    'treel' => [
        'alerte' => "Alertes",
        'journal' => "Journal",
        'anomalie' => 'Anomalies matériel',
        'test' => "Tests"
    ],

    // PAGE NIVEAU
    'niveau' => [
        'titre' => 'Niveau',
        'texte' => 'Permet de créer, modifier, supprimer les différents niveaux des parkings. Un niveau peut être composé de plusieurs plans.',
        'nb_plan' => 'Nb plans',
        'download_plan' => "Télécharger plan",
        'modif_plan' => "Modifier plan",
        'libelleExists' => "Le nom de niveau existe déjà"
    ],

    'parking' => [
        'texte' => 'Permet de créer, modifier, supprimer des parkings. Un parking peut être composé de plusieurs niveaux.',
        'titre' => "Gestion des parkings",
        'libelleExists' => "Le nom du parking existe déjà",
        'users' => "Utilisateurs associés au parking",
        'init' => "Initialisation",
        'btn' => "Lancer",
        'txt' => "Parking déjà initialisé"
    ]
);

