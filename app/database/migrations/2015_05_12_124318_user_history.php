<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserHistory extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('afficheur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('alerte', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('alerte_place', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('allee', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('calendrier', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('capteur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('concentrateur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('config', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('etat_capteur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('etat_general', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('etat_occupation', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('journal_alerte', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('journal_equipement_plan', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('journal_parking', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('journal_zone', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('jour_calendrier', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });


        Schema::table('modules', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('module_module', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('niveau', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('parking', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('parking_concentrateur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('parking_utilisateur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('password_reminders', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('place', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('plan', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profils', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_module', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('reservation', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('type_afficheur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('type_alerte', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('type_eclairage', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('type_place', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('utilisateurs', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('zone', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
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
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('alerte', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('alerte_place', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('allee', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('calendrier', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('capteur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('concentrateur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('config', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('etat_capteur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('etat_general', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('etat_occupation', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('journal_alerte', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('journal_equipement_plan', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('journal_parking', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('journal_zone', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('jour_calendrier', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });


        Schema::table('modules', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('module_module', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('niveau', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('parking', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('parking_concentrateur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('parking_utilisateur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('password_reminders', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('place', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('plan', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('profils', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('profil_module', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('reservation', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('type_afficheur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('type_alerte', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('type_eclairage', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('type_place', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('utilisateurs', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('zone', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });
    }

}
