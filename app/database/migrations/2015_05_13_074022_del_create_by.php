<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DelCreateBy extends Migration {

    private $tables = [
        'modules',
        'module_module',
        'password_reminders',
        'profils',
        'profil_module',
        'profil_utilisateur',
        'utilisateurs'
    ];

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        foreach($this->tables as $table) {
            Schema::table($table, function ($t) {
                $t->dropForeign($t->getTable().'_create_by_foreign');
                $t->dropColumn('create_by');
            });
        }
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
