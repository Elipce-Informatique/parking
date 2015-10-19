<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ConcentrateurUnicity extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('concentrateur', function ($t) {
            $t->unique(['parking_id','v4_id']);
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('concentrateur', function ($t) {
            $t->dropUnique('concentrateur_parking_id_v4_id_unique');
        });
	}

}
