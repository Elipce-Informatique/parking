<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestamps extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('journal_parking', function ($t) {
            $t->timestamps();
        });

        Schema::table('journal_zone', function ($t) {
            $t->timestamps();
        });

        Schema::table('jour_calendrier', function ($t) {
            $t->timestamps();
        });

        Schema::table('migrations', function ($t) {
            $t->timestamps();
        });

        Schema::table('modules', function ($t) {
            $t->timestamps();
        });

        Schema::table('module_module', function ($t) {
            $t->timestamps();
        });

        Schema::table('niveau', function ($t) {
            $t->timestamps();
        });

        Schema::table('parking', function ($t) {
            $t->timestamps();
        });

        Schema::table('parking_concentrateur', function ($t) {
            $t->timestamps();
        });

        Schema::table('parking_utilisateur', function ($t) {
            $t->timestamps();
        });

        Schema::table('place', function ($t) {
            $t->timestamps();
        });

        Schema::table('plan', function ($t) {
            $t->timestamps();
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->timestamps();
        });

        Schema::table('reservation', function ($t) {
            $t->timestamps();
        });

        Schema::table('type_afficheur', function ($t) {
            $t->timestamps();
        });

        Schema::table('type_alerte', function ($t) {
            $t->timestamps();
        });

        Schema::table('type_eclairage', function ($t) {
            $t->timestamps();
        });

        Schema::table('type_place', function ($t) {
            $t->timestamps();
        });


        Schema::table('zone', function ($t) {
            $t->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('afficheur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('alerte', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('alerte_place', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('allee', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('calendrier', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('capteur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('concentrateur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('config', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('etat_capteur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('etat_general', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('etat_occupation', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('journal_alerte', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('journal_equipement_plan', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('journal_parking', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('journal_zone', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('jour_calendrier', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('migrations', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('modules', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('module_module', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('niveau', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('parking', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('parking_concentrateur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('parking_utilisateur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('password_reminders', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('place', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('plan', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('profils', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('profil_module', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('reservation', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('type_afficheur', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('type_alerte', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('type_eclairage', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('type_place', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('utilisateurs', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('zone', function ($t) {
            $t->dropTimestamps();
        });
    }

}
