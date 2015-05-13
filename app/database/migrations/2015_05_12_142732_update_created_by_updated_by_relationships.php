<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCreatedByUpdatedByRelationships extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $platform = Schema::getConnection()->getDoctrineSchemaManager()->getDatabasePlatform();
        $platform->registerDoctrineTypeMapping('enum', 'string');


        Schema::table('afficheur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');

        });

        Schema::table('alerte', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');

        });

        Schema::table('alerte_place', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('allee', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('calendrier', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('capteur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('concentrateur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('config', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('etat_capteur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('etat_general', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('etat_occupation', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('journal_alerte', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('journal_equipement_plan', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('journal_parking', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('journal_zone', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('jour_calendrier', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');

        });


        Schema::table('modules', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('module_module', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('niveau', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('parking', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('parking_concentrateur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('parking_utilisateur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('password_reminders', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('place', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('plan', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('profils', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('profil_module', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('reservation', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('type_afficheur', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('type_alerte', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('type_eclairage', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('type_place', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('utilisateurs', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::table('zone', function ($t) {
            $t->dropForeign($t->getTable() . '_create_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('create_by');
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }

}
