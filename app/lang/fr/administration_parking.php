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
        'etat_place' => 'Etat place',
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
        'ajouter_place' => 'Ajouter une place',
        'ajouter_place_auto' => 'Ajouter une série de places',
        'ajouter_allee' => 'Ajouter une allée',
        'ajouter_zone' => 'Ajouter une zone',
        'ajouter_afficheur' => 'Ajouter un afficheur',
        'nb_places' => 'Nombre de places',
        'intervalle_poteaux' => 'Espacement poteaux (nb places)',
        'largeur_poteaux' => 'Largeur des poteaux (cm)',
        'pref' => 'Pref.',
        'incr' => 'Inc.',
        'suff' => 'Suff.',
        '3_points_seulement' => 'Merci de tracer exactement 3 points !',
        'swal_interval_incorrect' => 'L\'interval entre les poteaux est incorrect, il doit être inférieur au nombre de places saisi.'
    ],

    // MODULE TEMPS REEL
    'treel' => [
        'alerte' => "Alertes",
        'journal' => "Journal",
        'anomalie' => 'Anomalies matériel',
        'test' => "Tests"
    ]
);

