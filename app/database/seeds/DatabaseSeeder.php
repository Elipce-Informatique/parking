<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('TypePlaceSeeder');
//        $this->call('SettingsSeeder');// Seulement si pas de settings dans la BDDD controller
	}

}
