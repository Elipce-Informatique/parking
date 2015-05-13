<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimeProfilUser extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('profil_utilisateur', function ($t) {
            $t->timestamps();
        });

        $tables = [
            'module_module',
            'profil_module',
            'profil_utilisateur'
        ];

        foreach($tables as $table) {
            Schema::table($table, function ($t) {
                $t->dropForeign($t->getTable().'_created_by_foreign');
                $t->dropColumn('created_by');
                $t->dropForeign($t->getTable().'_updated_by_foreign');
                $t->dropColumn('updated_by');
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
