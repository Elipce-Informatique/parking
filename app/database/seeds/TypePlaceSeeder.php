<?php

class TypePlaceSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$temp = TypePlace::find(1);
        $temp->v4_type_place = "generic";
        $temp->save();

        $temp = TypePlace::find(2);
        $temp->v4_type_place = "handicapped";
        $temp->save();

        $temp = TypePlace::find(3);
        $temp->v4_type_place = "electric";
        $temp->save();

        $temp = TypePlace::find(4);
        $temp->v4_type_place = "family";
        $temp->save();

        $temp = TypePlace::find(5);
        $temp->v4_type_place = "narrow";
        $temp->save();

        $temp = TypePlace::find(6);
        $temp->v4_type_place = "vip";
        $temp->save();

        $temp = TypePlace::find(7);
        $temp->v4_type_place = "staff";
        $temp->save();

        $temp = TypePlace::find(8);
        $temp->v4_type_place = "subscriber";
        $temp->save();
	}

}
