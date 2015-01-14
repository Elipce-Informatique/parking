<?php
return array(

    /*
    |--------------------------------------------------------------------------
    | TEXTES DE LA PAGE D'ADMINISTRATION
    |--------------------------------------------------------------------------
    */
    'accueil' => [
        'titre' => 'Administration de l\'application',
        'text' => 'La section d\'administration permet de gérer les utilisateurs et leurs droits d\'accès aux différentes pages',
        'block_utilisateur_titre' => 'Gestion Utilisateurs',
        'block_utilisateur_texte' => 'Administration des utilisateurs de l\'application et gestion de leur droits d\'accès.
        Les droits d\'accès se définissent en associant un ou plusieurs profils aux utilisateurs',
        'block_profil_titre' => 'Gestion Profils',
        'block_profil_texte' => 'Administration des profils de l\'application et association avec les modules.
        Une association profil-module donne le droit d\'acces au module par les personnes possédant le bon profil.',
    ],

    // MODULE UTILISATEURS
    'utilisateur' => [
        'titre' => 'Utilisateurs',
        'tableau' => array('nom' => 'Nom',
            'prenom' => 'Prénom',
            'email' => 'E-mail',
            'email2' => 'E-mail 2',
            'email3' => 'E-mail 3'),
        'fiche'=> 'Fiche ',
        'profilsAssocie' => 'Profils associés',
        'change_password' => 'Changement du mot de passe',
        'password_old' => 'Mot de passe actuel',
        'password_new' => 'Nouveau mot de passe',
        'password_confirm' => 'Confirmation nouveau mot de passe',
        'newPassConfirmError' => 'Les mots de passe sont différents.',
        'oldPassConfirmError' => 'Mot de passe incorrect',
    ],

    // MODULE PROFILS
    'profil' => [
        'visu' => 'Visu',
        'modif' => 'Modif',
        'aucun' => 'Aucun',
        'module'=> 'Modules'
    ]
);
