<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class Utilisateur extends Eloquent implements UserInterface, RemindableInterface
{

    use UserTrait, RemindableTrait;

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */

    protected $fillable = ['nom', 'prenom', 'email', 'password', 'photo'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = array('password', 'remember_token');

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function profils()
    {
        return $this->belongsToMany('Profil')->withTimestamps();
    }

    public function parkings()
    {
        return $this->belongsToMany('Parking');
    }

    public function preferences()
    {
        return $this->hasMany('Preference');
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER DE CLASSE
    |--------------------------------------------------------------------------
    */
    public function getMenuTopItems()
    {
        if (Session::has('menu_top_items')) {
            $modules = Session::get('menu_top_items');
        } else {
            $modules = $this
                ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
                ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
                ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
                ->join('modules', 'modules.id', '=', 'profil_module.module_id')
                ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
                ->where('utilisateurs.id', $this->id)
                ->where('module_module.is_menu', 1)
                ->whereNull('module_module.parent_id')
                ->groupBy('modules.id')
                ->orderBy('module_module.ordre')
                ->get(['modules.*', DB::raw('1 as `accessible`')]);
            Session::put('menu_top_items', $modules);
        }

        return $modules;
    }

    /**
     * Retourne les infos pour construire le menu de l'utilisateur dans le menu top
     *
     * @return mixed
     */
    public function menuTopInfosUser()
    {
        /*
         * [
         *   {label: "profil", route:"/utilisateur/120"},
         *   {label: "parametres", route:"/parametres"}
         * ]
         **/
        return json_encode([
            'nomUtilisateur' => $this->nom,
            'logoutRoute' => URL::asset('/') . "logout",
            'logoutText' => Lang::get('global.logout'),
            'dropdown' => [['label' => Lang::get('menu.user.profil'), 'route' => URL::to('moncompte')]]
        ]);
    }

    /**
     *
     */
    public function getMenuLeftItemsFromUrl($url)
    {
        $entete = Module::getTopLevelParentModuleFromUrl($url);
        $tabRetour = [];
        if ($entete) {
            Module::getChildrenModulesRecursifWithDroitsForMenu($tabRetour, $entete->id, $this->id);
        }
        return $tabRetour;
    }


    /**
     * Test accessibilité en lecture
     * @param $url
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function isModuleAccessibleByUrl($url)
    {
        $res = $this
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->leftJoin('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('modules.url', $url)
            ->where('utilisateurs.id', $this->id)
            ->groupBy('modules.id')
            ->get(['modules.*']);
        return (count($res) != 0);
    }

    /**
     * Test accessibilité en lecture
     * @param $url : url du module à tester
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function isModuleAccessible($id)
    {
        return (count($this
                ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
                ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
                ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
                ->join('modules', 'modules.id', '=', 'profil_module.module_id')
                ->leftJoin('module_module', 'module_module.fils_id', '=', 'modules.id')
                ->where('modules.id', $id)
                ->where('utilisateurs.id', $this->id)
                ->groupBy('modules.id')
                ->get(['modules.*'])) != 0);
    }

    public function getAllModules()
    {
        //->groupBy('modules.id')
        return $this
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->groupBy('modules.id')
            ->get(['modules.*', 'profil_module.access_level']);
    }

    public function getAllModulesForAuthuser()
    {
        return $this
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('utilisateurs.id', $this->id)
            ->get(['modules.*', 'profil_module.access_level']);
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER STATIQUES
    |--------------------------------------------------------------------------
    */
    /**
     * Calcule la liste de tous les utilisateurs de l'application
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUtilisateurs()
    {
        $res = Utilisateur::all(array('id', 'nom', 'prenom', 'email'));//, DB::raw('email as mail2'), DB::raw('email as mail3')
        return $res;
    }

    /**
     * Infos d'un utilisateur
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUtilisateurFromId($id)
    {
        $res = Utilisateur::find($id);
        return $res;
    }

    /**
     * Récupère tous les profils du user
     * @param $id : ID utilisateur
     * @return array
     */
    public static function getProfilsUsers($id)
    {
        // Utilisateur existe
        if ($id !== 0) {
            $data = Utilisateur::find($id);
            $data['dataProfil'] = [];

            $dataProfil = DB::table('profils')->leftJoin('profil_utilisateur', function ($join) use ($id) {
                $join->on('profil_utilisateur.profil_id', '=', 'profils.id');
                $join->on('profil_utilisateur.utilisateur_id', '=', DB::raw($id));
            })
                ->groupBy('profils.id')
                ->get(['profils.id', 'profils.traduction', DB::raw("IF(profil_utilisateur.profil_id IS NULL,'non', 'oui')AS profil")]);

            $data['dataProfil'] = $dataProfil;
        } // Récupère uniquement les profils
        else {
            $data = [
                'id' => 0,
                'nom' => '',
                'prenom' => '',
                'email' => '',
                'photo' => 'no.gif',
                'dataProfil' => DB::table('profils')->get(array('id', 'traduction', DB::raw('"non" as profil')))
            ];
        }
        return $data;
    }

    /**
     * Supprime un utilisateur
     * @param $id : ID user
     * @return array('data' => tableau de données, 'save' => bool, enregistrement OK ou KO)
     *
     */
    public static function deleteUser($id)
    {
        // Variables
        $bSave = true;

        // Chercher user
        $user = Utilisateur::find($id);

        // Supprimer utilisateur
        try {
            $user->deletePhoto();
            $user->delete();
        } catch (Exception $e) {
            $bSave = false;
        }
        return array('data' => array('id' => 0, 'nom' => '', 'prenom' => '', 'email' => ''), 'save' => $bSave);
    }

    /**
     * Méthode d'instance pour supprimer la photo attachée à cet utilisateur.
     *
     * @return bool : statu de la suppression (false si l'utilisateur n'a pas de photo autre que no.gif)
     */
    public function deletePhoto()
    {
        $photo = $this->photo;
        $path = storage_path() . '/documents/photo/' . $photo;
        if ($photo != "no.gif" && File::exists($path)) {
            return File::delete($path);
        }
        return false;
    }

    /**
     * Met à jour les infos d'un utilisateur
     * @param $id : ID user
     * @param $fields : array($key=>$value) $key=champ table, $value=valeur
     * @return array('data' => tableau de données, 'save' => bool, enregistrement OK ou KO)
     */
    public static function updateUser($id, $fields)
    {
        // Variables
        $bSave = true;

        // Trouver le user
        $user = Utilisateur::find($id);

        // Test si photo:
        if (Input::hasFile('photo')) {
            // Suppression de la photo
            $user->deletePhoto();

            /* Extension du fichier */
            $extFile = Input::file('photo')->getClientOriginalExtension();

            /* Nom du fichier (email + extension) */
            $fileName = $fields['email'];
            $fileName = str_replace('.', '', $fileName);
            $fileName = str_replace('@', '', $fileName);
            $fileName .= '.' . $extFile;

            /* Sauvegarde de la photo dans le bon dossier */
            $destPath = storage_path() . '/documents/photo';
            Input::file('photo')->move($destPath, $fileName);

            /* Mise à jour du champ en base de donnée */
            $user->photo = $fileName;
        }

        // Récupère la donnée de l'utilisateur
        $user->nom = strtoupper($fields['nom']);
        $user->prenom = ucfirst(strtolower($fields['prenom']));
        $user->email = $fields['email'];

        // Mot de passe changé
        if (isset($fields['passNew']) && isset($fields['passOld'])) {
            $user->password = Hash::make($fields['passNew']);
        }

        // Sauvegarde
        try {
            // Début transaction SQL
            DB::beginTransaction();

            // Sauvegarde des données utilisateur
            if ($bSave = $user->save()) {
                // Parcours des droits de chaque profil
                foreach ($fields as $key => $value) {
                    // On coupe le name courant selon '_'
                    $aEtat = explode('_', $key);
                    // Radio
                    if ($aEtat[0] == 'profil') {
                        // Profil concerné
                        $profilId = $aEtat[1];
                        // Plus d'accès
                        if ($value == 'non') {
                            // Supprime un profil au user
                            $user->profils()->detach($profilId);
                        } // Nouveau droit
                        else {
                            $user->profils()->attach($profilId);
                        }
                    }
                }

                // Sauvegarde OK
                if ($bSave) {
                    // Transaction SQL Ok
                    DB::commit();
                } // Sauvegarde KO
                else {
                    // Transaction SQL KO
                    DB::rollback();
                    Log::debug('Erreur update utilisateur (false) ' . DB::getQueryLog());
                }
            }
        } // Erreur dans la transaction SQL
        catch (Exception $e) {
            Log::debug('Erreur update utilisateur (catch) ' . $e->getMessage());
            $bSave = false;
            DB::rollback();
        }

        return array('save' => $bSave, 'idUser' => $id);
    }

    /**
     * Créé un utilisateur
     * @param $fields : array($key=>$value) $key=champ table, $value=valeur
     * @return array('idUser' => idUser, 'save' => bool)
     */
    public static function creerUtilisateur($fields)
    {
        $bSave = true;

        // Email existe?
        $bExists = Utilisateur::isMailExists($fields['email']);

        // Email n'existe pas
        if (!$bExists) {

            // Récupère la donnée de l'utilisateur
            $fieldUser = [
                'nom' => strtoupper($fields['nom']),
                'prenom' => ucfirst(strtolower($fields['prenom'])),
                'email' => $fields['email']
            ];

            // Mot de passe généré sur 8 digits
            $pwd = Hash::make(time());
            $pwd = substr($pwd, 8, 6);// 6 caractères au hasard
            $pwd = 'k' . $pwd . '1';// au moins une lettre et un chiffre
            $pwdBdd = Hash::make($pwd); // Cryptage avant enregistrement
            $fieldUser['password'] = $pwdBdd;

            // Photo renseignée
            if (Input::hasFile('photo')) {
                // Extension du fichier
                $extFile = Input::file('photo')->getClientOriginalExtension();

                //  Nom du fichier (email + extension)
                $fileName = str_replace(array('.', '@'), array('', ''), $fields['email']); // Suppression des points et @
                $fileName .= '.' . $extFile; // Ajout extension

                // Sauvegarde de la photo dans le bon dossier
                $destPath = storage_path() . '/documents/photo';
                Input::file('photo')->move($destPath, $fileName);

                // Mise à jour du champ en base de donnée
                $fieldUser['photo'] = $fileName;
            } // Photo par défaut
            else {
                $fieldUser['photo'] = 'no.gif';
            }

            try {
                // Début transaction SQL
                DB::beginTransaction();

                // Nouvel utilisateur
                $oUser = Utilisateur::create($fieldUser);
                $idUser = $oUser->id;

                // Parcours des profils du user
                foreach ($fields as $key => $value) {
                    // On coupe le name courant selon '_'
                    $aEtat = explode('_', $key);
                    // Radio
                    if ($aEtat[0] == 'profil' && $value == 'oui') {

                        $profilId = $aEtat[1];
                        // Ajoute un profil au user
                        $oUser->profils()->attach($profilId);
                    }
                }

                // Création et envoie du mail
                $titre = Lang::get('mail.creation_utilisateur_titre');
                $texte = str_replace('[-pwd-]', $pwd, Lang::get('mail.creation_utilisateur_text'));
                $infos = array(
                    'nom' => $fieldUser['nom'],
                    'prenom' => $fieldUser['prenom'],
                    'titre' => $titre,
                    'texte' => $texte);
                Mail::send('emails.creation_utilisateur', $infos, function ($message) use ($fields, $titre) {
                    $message->to($fields['email'])->subject($titre);
                });

                // Transaction OK
                DB::commit();
                $retour = array(
                    'idUser' => $idUser,
                    'save' => $bSave
                );
            } catch (Exception $e) {
                Log::debug('Erreur insert utilisateur (catch) ' . $e->getMessage());
                // Transaction KO
                DB::rollback();
                $retour = array('save' => false);
            }
        } // Email existe déjà
        else {
            $retour = array('save' => false);
        }
        return $retour;
    }

    /**
     * Retourne true si l'utilisateur existe, false sinon
     * @param $email email de l'utilisateur
     * @return bool true/false
     */
    public static function isMailExists($email, $idUser = 0)
    {
        $and = $idUser === 0 ? '' : " AND id <> $idUser";
        $nb = DB::table('utilisateurs')->whereRaw("email='$email' $and")->count();
        return ($nb > 0);
    }

    /**
     * Bon mot de passe ?
     * @param $pass : mot de passe
     * @return array
     */
    public static function isPasswordOk($pass)
    {
        // Utilisateur connecté
        $oUser = Auth::user();
        // Hash du mot de passe
        return Hash::check($pass, $oUser->password);
    }


    /**
     * Récupère les préférences dont les clés sont listés dans le tableaud de param
     * Toutes les préférences si aucunes clés fournies
     *
     * @param $keys : Clés à récupérer
     */
    public function getPreferences($keys = [], $parkingId = '')
    {
        $whereKeys = "('" . implode($keys, "','") . "')";
        if ($parkingId == '') {
            return $this
                ->with(['preferences' => function ($q) use ($keys, $whereKeys) {
                    if (count($keys) > 0) {
                        $q->whereRaw('preference.key in ' . $whereKeys);
                    }
                }])
                ->where('id', '=', $this->id)
                ->select('id')
                ->first();
        } else {
            return $this
                ->with(['preferences' => function ($q) use ($keys, $whereKeys, $parkingId) {
                    if (count($keys) > 0) {
                        $q->whereRaw('preference.key in ' . $whereKeys)
                            ->where('parking_id', '=', $parkingId);
                    }
                }])
                ->where('id', '=', $this->id)
                ->select('id')
                ->first();
        }
    }

    /**
     * Ajoute les préférences passés en params à l'utilisateur
     * @param $preferences => tableau associatif [key=>value,key=>value,key=>value,key=>value]
     * @param string $parkingId => optionnel, préférences sur un parking
     * @return true ou false => résultat de l'insertion
     */
    public function setPreferences($preferences, $parkingId = '')
    {
        $idUser = $this->id;
        // Création des préférences

        try {
            foreach ($preferences As $key => $value) {
                $pref = false;
                if ($parkingId != '') {
                    $pref = Preference::create([
                        'parking_id' => $parkingId,
                        'utilisateur_id' => $idUser,
                        'key' => $key,
                        'value' => $value
                    ]);
                    $pref->utilisateur()->associate($this);
                    $pref->save();
                } else {
                    $pref = Preference::create([
                        'utilisateur_id' => $idUser,
                        'key' => $key,
                        'value' => $value
                    ]);
                    $pref->utilisateur()->associate($this);
                    $pref->save();
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * supprime les préférences passés en params de l'utilisateur
     * @param $keys => tableau associatif des clés à supprimer
     * @param string $parkingId => optionnel, préférences sur un parking
     * @return bool
     */
    public function deletePreferences($keys, $parkingId = '')
    {
        $idUser = $this->id;

        try {
            if ($parkingId != '') {
                $affected = Preference::where('utilisateur_id', '=', $idUser)
                    ->where('parking_id', '=', $parkingId)
                    ->whereIn('key', $keys)
                    ->delete();
            } else {
                $affected = Preference::where('utilisateur_id', '=', $idUser)
                    ->whereIn('key', $keys)
                    ->delete();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }

    }
}
