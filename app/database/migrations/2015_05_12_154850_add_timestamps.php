<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestamps extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('migrations', function ($t) {
            $t->timestamps();
        });

        Schema::table('modules', function ($t) {
            $t->timestamps();
        });

        Schema::table('module_module', function ($t) {
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
        Schema::table('migrations', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('modules', function ($t) {
            $t->dropTimestamps();
        });

        Schema::table('module_module', function ($t) {
            $t->dropTimestamps();
        });
	}

}
