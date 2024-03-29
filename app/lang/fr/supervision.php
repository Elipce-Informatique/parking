<?php
return array(

    /*
    |--------------------------------------------------------------------------
    | TEXTES DU METIER SUPERVISION
    |--------------------------------------------------------------------------
    */
    'accueil' => [
        'titre' => 'Supervision parking',
        'text' => 'La section supervision permet d\'avoir une vue d\'ensemble de l\'état d\'un parking',
        "block_visualisation_titre" => "Visualisation d'un parking",
        "block_visualisation_texte" => "Permet d'avoir une vue d'ensemble d'un parking, de son occupation et d'afficher des statistiques d'utilisation.",
        "block_alerte_titre" => "Gestion des alertes et des réservations",
        "block_alerte_texte" => "Permet de créer, modifier, supprimer des alertes de type 'zone complète' ou 'changement d'état de la place'. Permet également de créer, modifier, supprimer des réservations de places.",
    ],
    'carte' => [
        'selection_plan' => 'Veuillez sélectionner un plan à superviser dans le menu de gauche.',
    ],
    'tab_bord' => [
        'global' => 'Global',
        'global_parking' => 'Global parking',
        'global_niveau' => 'Global niveau',
        'global_zone' => 'Global zone',
        'tooltip_occupation' => 'de places occupées',
        'swal_aucune_place' => 'Aucune place n\'est renseignée sur ce parking.',
        'type_place' => "Type de place",
        'types_places' => "Types de places",
        "b1" => "Préférences d'affichage bloc général",
        "b2" => "Préférences d'affichage bloc plans",
        "b3" => "Préférences d'affichage bloc zones",

    ],
    'temps_reel' => [
        'j_place_occupee' => "La place [-] est occupée",
        'j_place_libre' => "La place [-] est libre",
    ],
    'alerte' => [
        'description' => 'Veuillez sélectionner un plan afin de définir des alertes et réservations',
        'full' => 'Alerte groupe de places complet',
        'change' => 'Alerte changement état place',
        'reservation' => 'Réserver des places',
        'msg_full' => "Les places ... à ... sont occupées"
    ],
    'commandes' => [
        'forcer_etat' => 'Forcer état',
        'faire_clignoter' => 'Faire clignoter',
        'changer_signalisation' => 'Changer signalisation',
        'changer_compteur' => 'Changer compteur',
        'fermeture_parking' => "Fermeture du parking",
        'ouverture_parking' => "Ouverture du parking",
        'veille_parking' => "Activer le mode veille éco",
        'eveil_parking' => "Désactiver le mode veille éco",
        'placeholder' => "En attente de la communication..."
    ]
);
