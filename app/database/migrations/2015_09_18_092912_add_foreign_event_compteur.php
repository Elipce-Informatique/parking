<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignEventCompteur extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('event_compteur', function ($t) {
            $t->foreign('compteur_id')
                ->references('id')
                ->on('compteur')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event_compteur', function ($t) {
            $t->dropForeign('compteur_id');
        });
    }

}
