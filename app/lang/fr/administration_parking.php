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
    'carte' => [
        'erreur_polygon' => 'Les lignes d\'un polygon ne peuvent pas se croiser',
        'ajouter_carte' => 'Ajouter une place',
        'ajouter_allee' => 'Ajouter une allée',
        'ajouter_zone' => 'Ajouter une zone',
        'ajouter_afficheur' => 'Ajouter un afficheur'
    ]
);

