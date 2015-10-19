<?php

class SettingsSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Settings
        $settings = [
            // Sensor height
            [
                "libelle" => "Dist. up to 1,50m - Vertical Height up to 1,00m",
                "json" => json_encode([
                    "height" => 1
                ])
            ],
            [
                "libelle" => "Dist. 1,50m-2,00m - Vertical Height 1,00m-1,40m",
                 "json" => json_encode([
                    "height" => 2
                ])
            ],
            [
                "libelle" => "Dist. 2,00m-2,50m - Vertical Height 1,40m-1,80m",
                 "json" => json_encode([
                    "height" => 3
                ])
            ],
            [
                "libelle" => "Dist. 2,50m-3,00m - Vertical Height 1,80m-2,10m",
                 "json" => json_encode([
                    "height" => 4
                ])
            ],
            [
                "libelle" => "Dist. 3,00m-4,00m - Vertical Height 2,10m-2,80m",
                 "json" => json_encode([
                    "height" => 5
                ])
            ],
            // Sensor sensibility
            [
                "libelle" => "Sensibility Low",
                 "json" => json_encode([
                    "width" => 6
                ])
            ],
            [
                "libelle" => "Sensibility Medium",
                 "json" => json_encode([
                    "width" => 7
                ])
            ],
            [
                "libelle" => "Sensibility Max",
                 "json" => json_encode([
                    "width" => 8
                ])
            ],
            // Display arrow
            [
                "libelle" => "⇧",
                 "json" => json_encode([
                    "arrowPosition" => 101
                ])
            ],
            [
                "libelle" => "⇩",
                 "json" => json_encode([
                    "arrowPosition" => 102
                ])
            ],
            [
                "libelle" => "⇦",
                 "json" => json_encode([
                    "arrowPosition" => 103
                ])
            ],
            [
                "libelle" => "⇨",
                 "json" => json_encode([
                    "arrowPosition" => 104
                ])
            ],
            [
                "libelle" => "⇖",
                 "json" => json_encode([
                    "arrowPosition" => 105
                ])
            ],
            [
                "libelle" => "⇘",
                 "json" => json_encode([
                    "arrowPosition" => 106
                ])
            ],
            [
                "libelle" => "⇙",
                 "json" => json_encode([
                    "arrowPosition" => 107
                ])
            ],
            [
                "libelle" => "⇗",
                 "json" => json_encode([
                    "arrowPosition" => 108
                ])
            ],
            [
                "libelle" => "no arrow",
                 "json" => json_encode([
                    "arrowPosition" => 109
                ])
            ],
            // Display indicator
            [
                "libelle" => "Text Full",
                 "json" => json_encode([
                    "fullIndicator" => 110
                ])
            ],

            [
                "libelle" => "X",
                 "json" => json_encode([
                    "fullIndicator" => 111
                ])
            ],

            [
                "libelle" => "Sign no parking",
                 "json" => json_encode([
                    "fullIndicator" => 112
                ])
            ],
            [
                "libelle" => "Display Off",
                 "json" => json_encode([
                    "fullIndicator" => 113
                ])
            ],
            // Display language
            [
                "libelle" => "fr",
                 "json" => json_encode([
                    "language" => 121
                ])
            ],
            [
                "libelle" => "en",
                 "json" => json_encode([
                    "language" => 122
                ])
            ],
            [
                "libelle" => "es",
                 "json" => json_encode([
                    "language" => 123
                ])
            ],
            [
                "libelle" => "pt",
                 "json" => json_encode([
                    "language" => 124
                ])
            ],
            [
                "libelle" => "nl",
                 "json" => json_encode([
                    "language" => 125
                ])
            ],
            [
                "libelle" => "de",
                 "json" => json_encode([
                    "language" => 126
                ])
            ],
            [
                "libelle" => "pl",
                 "json" => json_encode([
                    "language" => 127
                ])
            ],
            [
                "libelle" => "ca",
                 "json" => json_encode([
                    "language" => 128
                ])
            ],
            // Show type icon
            [
                "libelle" => "Icon = yes",
                 "json" => json_encode([
                    "showTypeIcon" => true
                ])
            ],
            [
                "libelle" => "Icon = no",
                 "json" => json_encode([
                    "showTypeIcon" => false
                ])
            ]
        ];
        // Enable cell
        $debut = 200;
        for ($i = 1; $i <= 255; $i++) {
            $settings[] = [
                "libelle" => "Cell " . $i,
                 "json" => json_encode([
                    "enableCell" => $debut + $i
                ])
            ];
        }
        // Brightness
        for ($i = 0; $i <= 100; $i++) {
            $settings[] = [
                "libelle" => "Brightness " . $i."%",
                 "json" => json_encode([
                    "brightness" => $i
                ])
            ];
        }

        // Parse settings
        foreach($settings as $setting){
            // Insert
            try {
                $model = ConfigEquipement::firstOrCreate($setting);
                $model->v4_id = $model->id;
                $model->save();
            } catch (Exception $e) {
                Log::error('Setting insert error ' . $e->getMessage());
            }
        }
    }

}
