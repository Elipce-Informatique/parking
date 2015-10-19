<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterUniqueCapteur extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('capteur', function ($t) {
            $t->dropUnique('v4_id');
//            $t->dropUnique('capteur_bus_id_v4_id_unique'); // Si rollback alors ce nom
            $t->unique(['bus_id','adresse']);
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('capteur', function ($t) {
            $t->dropUnique('capteur_bus_id_adresse_unique');
            $t->unique(['bus_id','v4_id']);
        });
    }

}
