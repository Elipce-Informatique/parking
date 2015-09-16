<?php
/**
 * Created by PhpStorm.
 * User: vivian
 * Date: 16/09/2015
 * Time: 13:53
 */



use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterParking extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // ADD parking.init_mode DROP v4_id
        Schema::table('parking', function($table)
        {
            $table->enum('init_mode', array('0', '1', '2'))->default('1')->after('etat');
            $table->dropColumn('v4_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('parking', function($table)
        {
            $table->integer('v4_id')->after('init');
            $table->dropColumn('init_mode');
        });
    }

}

?>