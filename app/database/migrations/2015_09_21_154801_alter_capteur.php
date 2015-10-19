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

            $t->char('sn',100)->after('adresse');
            $t->integer('leg')->after('sn');
            $t->char('software_version',20)->after('leg');
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
            $t->dropColumn('sn');
            $t->dropColumn('leg');
            $t->dropColumn('software_version');
        });
	}

}
