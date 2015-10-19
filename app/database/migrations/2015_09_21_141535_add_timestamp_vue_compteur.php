<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestampVueCompteur extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vue', function ($t) {
            $t->timestamps();
        });
        Schema::table('compteur', function ($t) {
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
        Schema::table('vue', function ($t) {
            $t->dropTimestamps();
        });
        Schema::table('compteur', function ($t) {
            $t->dropTimestamps();
        });
    }

}
