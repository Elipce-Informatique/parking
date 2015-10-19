<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FieldDeleteAfficheur extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('afficheur', function ($t) {
            $t->enum('a_supprimer', array('0', '1'))->default('0');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('afficheur', function ($t) {
            $t->dropColumn('a_supprimer');
        });
    }

}
