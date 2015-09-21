<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCapteur extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('capteur', function ($t) {

            $t->integer('leg')->after('sn');
            $t->char('software_version',1)->after('leg');
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

            $t->dropColumn('leg');
            $t->dropColumn('software_version');
        });
	}

}
