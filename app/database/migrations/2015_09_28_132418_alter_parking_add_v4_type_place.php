<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterParkingAddV4TypePlace extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('type_place', function ($t) {
            $t->char('v4_type_place',20)->after('libelle');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('type_place', function ($t) {

            $t->dropColumn('v4_type_place');
        });
	}

}
