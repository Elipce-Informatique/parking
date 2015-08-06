ALTER TABLE  `afficheur` ADD  `v4_id` INT NOT NULL AFTER  `plan_id` ;
ALTER TABLE  `parking`.`afficheur` ADD UNIQUE  `v4_id` (  `v4_id` ,  `bus_id` );
ALTER TABLE  `capteur` ADD  `v4_id` INT NOT NULL AFTER  `bus_id` ;
ALTER TABLE  `parking`.`capteur` ADD UNIQUE  `v4_id` (  `v4_id` ,  `bus_id` );