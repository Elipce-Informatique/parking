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
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('module_module', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });



        Schema::table('password_reminders', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });


        Schema::table('profils', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_module', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
            $t->foreign('updated_by')->references('id')->on('utilisateurs');
        });


        Schema::table('utilisateurs', function ($t) {
            $t->integer('create_by')->nullable()->index();
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('create_by')->references('id')->on('utilisateurs');
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
        Schema::table('modules', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('module_module', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });



        Schema::table('password_reminders', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });



        Schema::table('profils', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('profil_module', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });

        Schema::table('profil_utilisateur', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });


        Schema::table('utilisateurs', function ($t) {
            $t->dropForeign('create_by');
            $t->dropForeign('updated_by');


        });
	}

}
