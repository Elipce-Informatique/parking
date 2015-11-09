<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexes extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        // Snsors events
        Schema::table('capteur', function ($table) {
            $table->index('v4_id');
            $table->index('id');
        });

        Schema::table('etat_occupation', function ($table) {
            $table->index('is_occupe');
            $table->index('id');
        });

        Schema::table('event_capteur', function ($table) {
            $table->index('capteur_id');
            $table->index('id');
        });

        Schema::table('place', function ($table) {
            $table->index('id');
        });

        // Views events
        Schema::table('type_place', function ($table) {
            $table->index('cell_nb');
        });

        Schema::table('afficheur', function ($table) {
            $table->index('v4_id');
        });

        Schema::table('compteur', function ($table) {
            $table->index('v4_id');
        });

	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('capteur', function ($table) {
            $table->dropIndex('v4_id');
            $table->dropIndex('id');
        });

        Schema::table('etat_occupation', function ($table) {
            $table->dropIndex('is_occupe');
            $table->dropIndex('id');
        });

        Schema::table('event_capteur', function ($table) {
            $table->dropIndex('capteur_id');
            $table->dropIndex('id');
        });

        Schema::table('place', function ($table) {
            $table->dropIndex('id');
        });

        // Views events
        Schema::table('type_place', function ($table) {
            $table->dropIndex('cell_nb');
        });

        Schema::table('afficheur', function ($table) {
            $table->dropIndex('v4_id');
        });

        Schema::table('compteur', function ($table) {
            $table->dropIndex('v4_id');
        });
	}

}
