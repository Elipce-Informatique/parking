<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ConcentrateurBus extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('bus', function ($t) {

            $t->dropForeign('bus_ibfk_2');
            $t->foreign('concentrateur_id')
                ->references('id')
                ->on('concentrateur')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('bus', function ($t) {
            $t->dropForeign('bus_ibfk_2');
        });
	}

}
