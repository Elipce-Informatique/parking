<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedBy extends Migration {

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
                $t->integer('created_by')->nullable()->index();
                $t->foreign('created_by')->references('id')->on('utilisateurs');
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
        foreach($this->tables as $table) {
            Schema::table($table, function ($t) {
                $t->dropForeign($t.'_created_by_foreign');
                $t->dropColumn('created_by');
            });
        }
	}

}
