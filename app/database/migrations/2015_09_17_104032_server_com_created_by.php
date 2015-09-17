<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ServerComCreatedBy extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('server_com', function ($t) {
            $t->integer('created_by')->nullable()->index();
            $t->foreign('created_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
            $t->integer('updated_by')->nullable()->index();
            $t->foreign('updated_by')->references('id')->on('utilisateurs')->onDelete('set null')->onUpdate('cascade');
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
        Schema::table('server_com', function ($t) {
            $t->dropForeign($t->getTable() . '_created_by_foreign');
            $t->dropForeign($t->getTable() . '_updated_by_foreign');
            $t->dropColumn('created_by');
            $t->dropColumn('updated_by');
            $t->dropTimestamps();
        });
	}

}
