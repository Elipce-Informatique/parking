<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterUniqueLibelleConfEquipement extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('config_equipement', function ($t) {
            $t->dropUnique('libelle');
            $t->unique('libelle');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('config_equipement', function ($t) {
            $t->dropUnique('config_equipement_libelle_unique');
        });
    }
}