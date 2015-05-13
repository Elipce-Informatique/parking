<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserHistory extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('modules', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('module_module', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });



        Schema::table('password_reminders', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });


        Schema::table('profils', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_module', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });


        Schema::table('utilisateurs', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

    }

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        $tables = [
            'modules',
            'module_module',
            'password_reminders',
            'profils',
            'profil_module',
            'profil_utilisateur',
            'utilisateurs'
        ];

        foreach($tables as $table) {
            Schema::table($table, function ($t) {
                $t->dropForeign($t.'_created_by_foreign');
                $t->dropColumn('created_by');
            });
        }


	}

}
