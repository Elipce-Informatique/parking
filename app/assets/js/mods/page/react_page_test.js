/***********************/
var React = require('react/addons');
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/*********************************************/
/* Composant input pour le libelle du profil */
var Field = require('../composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var RadioGroup = Field.RadioGroup;
var InputRadioEditable = Field.InputRadioEditable;
var ButtonGroup = ReactB.ButtonGroup;
var InputRadioBootstrapEditable = Field.InputRadioBootstrapEditable;
var InputCheckboxEditable = Field.InputCheckboxEditable;
var InputDateEditable = Field.InputDateEditable;
var InputSelect = Field.InputSelect;
var InputSelectEditable = Field.InputSelectEditable;
var InputNumberEditable = Field.InputNumberEditable;
var InputTelEditable = Field.InputTelEditable;
var react_photo = require('../composants/react_photo');
var ImageEditable = react_photo.PhotoEditable;
var react_color = require('../composants/react_color');
var ColorPicker = react_color.ColorPicker;
var ColorPickerEditable = react_color.ColorPickerEditable;
//var DateTimePicker              = require('react-bootstrap-datetimepicker');
var InputDate = Field.InputDate;
var InputDateEditable = Field.InputDateEditable;
var InputTime = Field.InputTime;
var InputTimeEditable = Field.InputTimeEditable;
var Form = Field.Form;

var ModalUn = require('../composants/modals/test_modal_1');
var Modal2 = require('../composants/modals/test_modal_2');
var Modal = ReactB.Modal;
var Select = require('react-select');

/*****************************************************
 /* MIXINS */
var MixinGestMod = require('../mixins/gestion_modif');

/*****************************************************
 /* HELPERS */
var form_data_helper = require('../helpers/form_data_helper');
var pageState = require('../helpers/page_helper').pageState;


/******************************************************************
 * *************** COM WEBSOCKET *********************************
 ****************************************************************
 */
var com = require('../helpers/com_helper');
var messagesHelper = com.messages;
var supervision_helper = require('../helpers/supervision_helper');


/**************************************************
 * PAGE REACT
 */
var ReactPageTest = React.createClass({

        mixins: [MixinGestMod, Reflux.ListenerMixin, ReactB.OverlayMixin],
        clientWs: '',
        viewEvents: [
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 2,
                state: "normal",
                count: 60,
                occupied: 40,
                free: 60
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 3,
                state: "normal",
                count: 7,
                occupied: 8,
                free: 7
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 4,
                state: "normal",
                count: 2,
                occupied: 8,
                free: 10
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 2,
                state: "normal",
                count: 10,
                occupied: 90,
                free: 10
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 6,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "30"
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 3,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "full"
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 4,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "empty"
            },
            // AFFICHEUR 2
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 5,
                state: "normal",
                count: 10,
                occupied: 90,
                free: 38
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 6,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "full"
            }],
        events: [{
            "dfu": false,
            "class": "sensor",
            "sense": "free",
            "date": "2015-09-03T12:23:55",
            "event": "state",
            "ID": 18,
            "supply": 63500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 19,
            "supply": 63000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 20,
            "supply": 62500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 21,
            "supply": 62000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 22,
            "supply": 61500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 23,
            "supply": 61000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 24,
            "supply": 60500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 25,
            "supply": 60000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 26,
            "supply": 59500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 27,
            "supply": 59000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 28,
            "supply": 58500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 29,
            "supply": 58000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 30,
            "supply": 57500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 31,
            "supply": 57000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 32,
            "supply": 56500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 33,
            "supply": 56000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 34,
            "supply": 55500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 35,
            "supply": 55000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 36,
            "supply": 54500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 37,
            "supply": 54000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 38,
            "supply": 53500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 39,
            "supply": 53000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 40,
            "supply": 52500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 41,
            "supply": 52000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 42,
            "supply": 51500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 43,
            "supply": 51000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 44,
            "supply": 50500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 45,
            "supply": 50000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 46,
            "supply": 49500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 47,
            "supply": 49000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 48,
            "supply": 48500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 49,
            "supply": 48000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 50,
            "supply": 47500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 51,
            "supply": 47000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 52,
            "supply": 46500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 53,
            "supply": 46000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 54,
            "supply": 45500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 55,
            "supply": 45000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 56,
            "supply": 44500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 57,
            "supply": 44000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 58,
            "supply": 43500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 59,
            "supply": 43000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 60,
            "supply": 42500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 61,
            "supply": 42000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 62,
            "supply": 41500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 63,
            "supply": 72000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 64,
            "supply": 71500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 65,
            "supply": 71000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 66,
            "supply": 70500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 67,
            "supply": 70000,
            "state": "probing"
        }, {
            "dfu": false,
            "class": "sensor",
            "sense": "free",
            "date": "2015-09-03T12:23:55",
            "event": "state",
            "ID": 68,
            "supply": 69500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 69,
            "supply": 69000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 70,
            "supply": 68500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 71,
            "supply": 68000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 72,
            "supply": 67500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 73,
            "supply": 67000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 74,
            "supply": 66500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 75,
            "supply": 66000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 76,
            "supply": 65500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 77,
            "supply": 65000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 78,
            "supply": 64500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 79,
            "supply": 64000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 80,
            "supply": 63500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 81,
            "supply": 63000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 82,
            "supply": 62500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 83,
            "supply": 62000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 84,
            "supply": 61500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 85,
            "supply": 61000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "occupied",
            "ID": 86,
            "supply": 60500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 87,
            "supply": 60000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 88,
            "supply": 59500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 89,
            "supply": 59000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 90,
            "supply": 58500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 91,
            "supply": 58000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 92,
            "supply": 57500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 93,
            "supply": 57000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 94,
            "supply": 56500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 95,
            "supply": 56000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 96,
            "supply": 55500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 97,
            "supply": 55000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 98,
            "supply": 54500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 99,
            "supply": 54000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 100,
            "supply": 53500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 101,
            "supply": 53000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 102,
            "supply": 52500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 103,
            "supply": 52000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 104,
            "supply": 51500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 105,
            "supply": 51000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 106,
            "supply": 50500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 107,
            "supply": 50000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 108,
            "supply": 49500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 109,
            "supply": 49000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 110,
            "supply": 48500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 111,
            "supply": 48000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 112,
            "supply": 47500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 113,
            "supply": 47000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 114,
            "supply": 46500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 115,
            "supply": 46000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "date": "2015-09-03T12:23:56",
            "ID": 116,
            "supply": 45500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 117,
            "supply": 45000,
            "state": "probing"
        }, {
            "dfu": false,
            "class": "sensor",
            "sense": "free",
            "date": "2015-09-03T12:23:56",
            "event": "state",
            "ID": 118,
            "supply": 44500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 119,
            "supply": 44000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 120,
            "supply": 43500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 121,
            "supply": 43000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 122,
            "supply": 42500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 123,
            "supply": 42000,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 124,
            "supply": 41500,
            "state": "probing"
        }, {
            "dfu": false,
            "sense": "free",
            "ID": 125,
            "supply": 41000,
            "state": "probing"
        }, {
            "date": "2015-09-03T12:23:57",
            "ID": 1,
            "state": "online"
        }, {
            "ID": 2,
            "state": "online"
        }, {
            "ID": 3,
            "state": "online"
        }, {
            "date": "2015-09-03T12:23:58",
            "ID": 4,
            "state": "online"
        }, {
            "ID": 5,
            "state": "online"
        }, {
            "ID": 6,
            "state": "online"
        }, {
            "ID": 7,
            "state": "online"
        }, {
            "ID": 8,
            "state": "online"
        }, {
            "ID": 9,
            "state": "online"
        }, {
            "ID": 10,
            "state": "online"
        }, {
            "date": "2015-09-03T12:23:59",
            "ID": 11,
            "state": "online"
        }, {
            "ID": 12,
            "state": "online"
        }, {
            "ID": 13,
            "state": "online"
        }, {
            "ID": 14,
            "state": "online"
        }, {
            "ID": 15,
            "state": "online"
        }, {
            "ID": 16,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:00",
            "ID": 17,
            "state": "online"
        }, {
            "ID": 18,
            "state": "online"
        }, {
            "ID": 19,
            "state": "online"
        }, {
            "ID": 20,
            "state": "online"
        }, {
            "ID": 21,
            "state": "online"
        }, {
            "ID": 22,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:02",
            "ID": 23,
            "state": "online"
        }, {
            "ID": 24,
            "state": "online"
        }, {
            "ID": 25,
            "state": "online"
        }, {
            "ID": 26,
            "state": "online"
        }, {
            "ID": 27,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:03",
            "ID": 28,
            "state": "online"
        }, {
            "ID": 29,
            "state": "online"
        }, {
            "ID": 30,
            "state": "online"
        }, {
            "ID": 31,
            "state": "online"
        }, {
            "ID": 32,
            "state": "online"
        }, {
            "ID": 33,
            "state": "online"
        }, {
            "ID": 34,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:04",
            "ID": 35,
            "state": "online"
        }, {
            "ID": 36,
            "state": "online"
        }, {
            "ID": 37,
            "state": "online"
        }, {
            "ID": 38,
            "state": "online"
        }, {
            "ID": 39,
            "state": "online"
        }, {
            "ID": 40,
            "state": "online"
        }, {
            "ID": 41,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:05",
            "ID": 42,
            "state": "online"
        }, {
            "class": "sensor",
            "date": "2015-09-03T12:24:05",
            "event": "state",
            "ID": 43,
            "state": "online"
        }, {
            "ID": 44,
            "state": "online"
        }, {
            "ID": 45,
            "state": "online"
        }, {
            "ID": 46,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:07",
            "ID": 47,
            "state": "online"
        }, {
            "ID": 48,
            "state": "online"
        }, {
            "ID": 49,
            "state": "online"
        }, {
            "ID": 50,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:08",
            "ID": 51,
            "state": "online"
        }, {
            "ID": 52,
            "state": "online"
        }, {
            "ID": 53,
            "state": "online"
        }, {
            "ID": 54,
            "state": "online"
        }, {
            "ID": 55,
            "state": "online"
        }, {
            "ID": 56,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:09",
            "ID": 57,
            "state": "online"
        }, {
            "ID": 58,
            "state": "online"
        }, {
            "ID": 59,
            "state": "online"
        }, {
            "ID": 60,
            "state": "online"
        }, {
            "ID": 61,
            "state": "online"
        }, {
            "ID": 62,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:10",
            "ID": 63,
            "state": "online"
        }, {
            "ID": 64,
            "state": "online"
        }, {
            "ID": 65,
            "state": "online"
        }, {
            "ID": 66,
            "state": "online"
        }, {
            "ID": 67,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:12",
            "ID": 68,
            "state": "online"
        }, {
            "ID": 69,
            "state": "online"
        }, {
            "ID": 70,
            "state": "online"
        }, {
            "ID": 71,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:13",
            "ID": 72,
            "state": "online"
        }, {
            "ID": 73,
            "state": "online"
        }, {
            "ID": 74,
            "state": "online"
        }, {
            "ID": 75,
            "state": "online"
        }, {
            "ID": 76,
            "state": "online"
        }, {
            "ID": 77,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:14",
            "ID": 78,
            "state": "online"
        }, {
            "ID": 79,
            "state": "online"
        }, {
            "ID": 80,
            "state": "online"
        }, {
            "ID": 81,
            "state": "online"
        }, {
            "ID": 82,
            "state": "online"
        }, {
            "ID": 83,
            "state": "online"
        }, {
            "ID": 84,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:15",
            "ID": 85,
            "state": "online"
        }, {
            "ID": 86,
            "state": "online"
        }, {
            "ID": 87,
            "state": "online"
        }, {
            "ID": 88,
            "state": "online"
        }, {
            "ID": 89,
            "state": "online"
        }, {
            "ID": 90,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:16",
            "ID": 91,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:17",
            "ID": 92,
            "state": "online"
        }, {
            "class": "sensor",
            "date": "2015-09-03T12:24:17",
            "event": "state",
            "ID": 93,
            "state": "online"
        }, {
            "ID": 94,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:18",
            "ID": 95,
            "state": "online"
        }, {
            "ID": 96,
            "state": "online"
        }, {
            "ID": 97,
            "state": "online"
        }, {
            "ID": 98,
            "state": "online"
        }, {
            "ID": 99,
            "state": "online"
        }, {
            "ID": 100,
            "state": "online"
        }, {
            "ID": 101,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:19",
            "ID": 102,
            "state": "online"
        }, {
            "ID": 103,
            "state": "online"
        }, {
            "ID": 104,
            "state": "online"
        }, {
            "ID": 105,
            "state": "online"
        }, {
            "ID": 106,
            "state": "online"
        }, {
            "ID": 107,
            "state": "online"
        }, {
            "ID": 108,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:20",
            "ID": 109,
            "state": "online"
        }, {
            "ID": 110,
            "state": "online"
        }, {
            "ID": 111,
            "state": "online"
        }, {
            "ID": 112,
            "state": "online"
        }, {
            "ID": 113,
            "state": "online"
        }, {
            "ID": 114,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:21",
            "ID": 115,
            "state": "online"
        }, {
            "ID": 116,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:22",
            "ID": 117,
            "state": "online"
        }, {
            "ID": 118,
            "state": "online"
        }, {
            "date": "2015-09-03T12:24:23",
            "ID": 119,
            "state": "online"
        }, {
            "ID": 120,
            "state": "online"
        }, {
            "ID": 121,
            "state": "online"
        }, {
            "ID": 122,
            "state": "online"
        }, {
            "ID": 123,
            "state": "online"
        }, {
            "ID": 124,
            "state": "online"
        }, {
            "ID": 125,
            "state": "online"
        }],
        ackIDsEvents: [
            0,
            50,
            100,
            150,
            200,
            233
        ],
        ackIdPointer: 0,
        ackId: 0,
        eventLoopStarted: false,

        startEventLoop: function () {
            //if (!this.eventLoopStarted) {
            //    this.eventLoopStarted = true;

            console.log('Lancement de la boucle d\'évènements');
            //setInterval(function () {
            if (this.ackIdPointer < (this.ackIDsEvents.length - 1)) {
                var tab = _.cloneDeep(this.events);
                tab.splice(
                    this.ackIDsEvents[this.ackIdPointer],
                    this.ackIDsEvents[this.ackIdPointer + 1] - this.ackIDsEvents[this.ackIdPointer]);

                var msg = {
                    "messageType": "eventData",
                    "data": {
                        "ackID": this.ackIDsEvents[this.ackIdPointer + 1],
                        "list": tab
                    }
                };
                this.clientWs.send(JSON.stringify(msg));
                this.ackIdPointer++;
            } else {
                this.ackIdPointer = 0;
            }
            //}.bind(this), 5000);
            //}
        },


        /**
         * Prépare le message pour mettre des vues à jour
         * @returns {{messageType: string, data: {ackID: number, list: *}}}
         */
        updateView: function () {

            var tab = _.cloneDeep(this.viewEvents);
            tab.splice(this.ackId, 3);
            this.ackId += 3;
            // RAZ
            if (this.ackId >= this.viewEvents.length) {
                this.ackId = 0;
            }

            console.log('page test ' + this.ackId + ' list: %o', tab);
            return {
                "messageType": "eventData",
                "data": {
                    "ackID": this.ackId,
                    "list": tab
                }
            }
        },

        /**
         * Envoie le message pour mettre des vues à jour
         */
        sendEventsView: function () {

            var msg = JSON.stringify(this.updateView());
            //console.log('message: %o', msg);
            //console.log('client: %o', this.clientWs);
            this.clientWs.send(msg);

        },
        /**
         * État initial des données du composant
         * @returns object : les données de l'état initial
         */
        getInitialState: function () {
            return {
                isModalOpen: false,
                modalType: 1,
                options: [],
                select: ''
            };
        },

        /**
         * Avant le premier Render()
         */
        componentWillMount: function () {
            this.listenTo(storeTest, this.update);
        },

        componentDidMount: function () {
            this.setState({
                options: [
                    {value: '1abricot', label: 'Abricot'},
                    {value: '2fambroise', label: 'Framboise'},
                    {value: '3pomme', label: 'Pomme'},
                    {value: '4poire', label: 'Poire'},
                    {value: '5fraise', label: 'Fraise'}
                ]
            })
        },

        /**
         * Test si le composant doit être réaffiché avec les nouvelles données
         * @param nextProps : Nouvelles propriétés
         * @param nextState : Nouvel état
         * @returns {boolean} : true ou false selon si le composant doit être mis à jour
         */
        shouldComponentUpdate: function (nextProps, nextState) {
            return true;
        },

        /**
         * Appellé en retour du store test
         * @param data
         */
        update: function (data) {
            this.setState(data);
        },


        /**
         * Appellé par le mixin MixinGestMod quand l'utilisateur a cliqué sur retour
         * et a validé l'intention de perdre toutes les modifications en cours.
         */
        onRetour: function () {

        },

        /**
         * Se base sur le state isModalOpen ET modalType
         * pour afficher ou non un modal.
         * Cette fonction est appellée au render initial et lors de toutes les updates du composant.
         * Le code retourné est ajouté à la fin du <body> de la page.
         */
        renderOverlay: function () {
            //console.log('Pass renderOverlay');
            var retour = {};
            switch (this.state.modalType) {
                case 1:
                    if (!this.state.isModalOpen) {
                        return <span key="modal-test"/>;
                    } else {
                        return <ModalUn key="modal-test" onToggle={this.toggleModal} />;
                    }
                    break;

                default:
                    if (!this.state.isModalOpen) {
                        return <span key="modal-test"/>;
                    } else {
                        return <Modal2 key="modal-test" onToggle={this.toggleModal} />;
                    }
                    break;
            }
            //console.log('retour : %o', retour);
            return retour;
        },

        /**
         * Inverse le booléen correspondant à l'état d'affichage de la modale
         */
        toggleModal: function () {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        },

        /**
         * Affiche le modal 1
         */
        toggleModal1: function () {
            this.setState({
                isModalOpen: true,
                modalType: 1
            });
        },

        /**
         * Affiche le modal 2
         */
        toggleModal2: function () {
            this.setState({
                isModalOpen: true,
                modalType: 2
            });
        },

        /**
         * Méthode appellée pour construire le composant.
         * A chaque fois que son contenu est mis à jour.
         * @returns {XML}
         */
        render: function () {
            var editable = true;
            var indice = 0;

            /*********************/
            /* Paramètres Select */


            function selectChange(value, aData) {

                _.each(aData, function (val, key) {
                    indice++;
                });
            }

            function clickImage(evt) {
                var copie = _.clone(evt);
            }

            /* FIN : Paramètres Select */
            /***************************/
            return (
                <div>
                    <Form attributes={{id: "form_com"}}>
                        <h1>COMMUNICATION TOOL</h1>
                        <Button
                            onClick={function () {
                                // Connexion controller
                                supervision_helper.init(0, 0, 1, 0, function OK(clientWs) {
                                    this.clientWs = clientWs;
                                    console.log('Connecté');
                                }.bind(this));
                            }.bind(this)}>
                            Connexion
                        </Button>
                        <Button
                            onClick={function sendQuery() {
                                this.clientWs.send(JSON.stringify(messagesHelper.settingsQuery()))
                            }}>
                            Send settingsQuery
                        </Button>
                        <Button
                            onClick={function sendReset() {
                                this.clientWs.send(JSON.stringify(messagesHelper.remoteControl('reset')))
                            }}>
                            Reset
                        </Button>

                        <Button
                            onClick={this.sendEventsView}>
                            View events
                        </Button>
                        <Button
                            onClick={this.startEventLoop}>
                            EventsLoop
                        </Button>

                    </Form>

                    <hr/>

                    <Form attributes={{id: "form_test"}}>

                        <InputTextEditable
                            attributes={
                            {
                                label: 'InputTextEditable',
                                name: "InputTextEditable",
                                value: 'Vivian',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <InputTextEditable
                            area={true}
                            attributes={{
                                label: 'InputTextEditableArea',
                                name: "InputTextEditableArea",
                                value: 'InputTextEditableArea',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <InputMailEditable
                            attributes={{
                                label: 'InputMailEditable',
                                name: "InputMailEditable",
                                value: 'InputMailEditable@elipce.com',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <InputPasswordEditable
                            attributes={{
                                label: 'InputPasswordEditable',
                                name: "InputPasswordEditable",
                                value: "",
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />


                        <ImageEditable
                            src='./app/assets/images/cross.gif'
                            evts={{onClick: clickImage}}
                            name="InputImageEditable"
                            attributes={{
                                name: "InputImageEditable",
                                imgCol: 4,
                                labelCol: 2
                            }}
                            editable={editable} />


                        <ColorPickerEditable
                            evts={{
                                onBlur: function (e) {
                                    console.log('blur color ' + $(e.currentTarget).val());
                                }
                            }}
                            label="Couleur modifiable"
                            mdColor={4}
                            mdLabel={2}
                            labelClass="text-right"
                            gestMod={true}
                            attributes={{name: "color", required: false, value: 'E2156B'}}
                            editable={editable} />

                        <InputSelectEditable
                            multi={false}
                            evts={{onChange: selectChange}}
                            attributes={{
                                label: 'Mes fruits',
                                name: "Select",
                                selectCol: 4,
                                labelCol: 2,
                                required: true
                            }}
                            data={this.state.options}
                            editable={editable}
                            placeholder={'PlaceHolder...'}
                            labelClass='text-right'
                            selectedValue={["5fraise", "3pomme"]}
                        />
                        <ColorPicker
                            color="FF2800"
                            label="Mon label"
                            mdLabel={3}
                            mdColor={2}
                            height={10}
                            width={20}
                            labelClass="text-right"
                        />

            {{
                /*
                 <InputSelectEditable
                 multi={true}
                 evts={{onChange: selectChange}}
                 attributes={{
                 label: 'Mes fruits',
                 name: "Select",
                 selectCol: 4,
                 labelCol: 2,
                 required: true
                 }}
                 data={this.state.options}
                 editable={editable}
                 placeholder={'PlaceHolder...'}
                 labelClass='text-right'
                 />
                 */
            }}

                        <InputSelectEditable
                            multi={false}
                            attributes={{name: "SelectSansLabel", selectCol: 4, required: true}}
                            data={this.state.options}
                            editable={editable}
                            placeholder={'PlaceHolder...'}
                            labelClass='text-right'
                            selectedValue={"3pomme"}
                        />
                        <Select
                            multi={false}
                            placeholder="Select your favourite(s)"
                            options={this.state.options}
                        />

                        <Button
                            bsStyle="success"
                            onClick={function () {
                                var fData = form_data_helper('form_test', 'POST');
                                //console.log('DATA: %o',fData);
                                var f = $('#form_test').serializeArray();
                                //console.log('DATA %o',f);
                                // Vérif champ erronés
                                Actions.validation.verify_form_save();
                            }}
                        >Valider</Button>

                        <InputNumberEditable
                            min={-10}
                            max={10}
                            step={0.1}
                            attributes={{
                                required: true,
                                label: 'Input number',
                                name: "InputNumber",
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <InputTelEditable
                            attributes={{
                                label: 'Input tel',
                                name: "InputTel",
                                htmlFor: 'form_test',
                                value: '0475757575',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <Row id="Champ_radioBoostrap">
                            <Col md={2}>
                                <label>Radio Boostrap NEW generation</label>
                            </Col>
                            <Col md={4}>
                                <RadioGroup attributes={{name: "bootstrap"}} bootstrap={true}>
                                    <InputRadioBootstrapEditable
                                        key={'bt1'}
                                        editable={editable}
                                        attributes={{
                                            checked: true,
                                            value: 'btn1'
                                        }}
                                        evts={{
                                            onClick: function () {
                                                console.log('CLICK');
                                            }
                                        }}
                                    >
                                        Btn 1
                                    </ InputRadioBootstrapEditable>
                                    <InputRadioBootstrapEditable
                                        key={'bt2'}
                                        editable={editable}
                                        attributes={{
                                            value: 'btn2'
                                        }}
                                        evts={{
                                            onClick: function () {
                                                console.log('CLICK');
                                            }
                                        }}
                                    >
                                        Btn 2
                                    </ InputRadioBootstrapEditable>
                                </RadioGroup>
                            </Col>
                            <Col md={4}>
                                <RadioGroup attributes={{name: "bootstrap"}} bootstrap={true}>
                                </RadioGroup>
                            </Col>
                        </Row>
            {/* EXemple de radio inline*/}
                        <RadioGroup
                            attributes={{
                                name: "radio"
                            }}>
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'InputRadioEditable 1',
                                    checked: true,
                                    name: "a_ecraser",
                                    value: 'un',
                                    groupClassName: 'col-md-2'
                                }}
                                evts={{
                                    onChange: function () {
                                        console.log('Change');
                                    }
                                }}
                                key = "zouzou"
                            />
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'InputRadioEditable 2',
                                    checked: false,
                                    name: "a_ecraser",
                                    value: 'deux',
                                    groupClassName: 'col-md-2'
                                }}
                                evts={{
                                    onChange: function () {
                                        console.log('Change');
                                    }
                                }}
                                key = "pitchoune"/>
                        </RadioGroup>

                 {/* EXemple de radio les uns sous les autres*/}
                        <RadioGroup
                            editable={editable}
                            attributes={{
                                name: "ab"
                            }}>
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'A',
                                    checked: true,
                                    name: "a_ecraser",
                                    value: 'A',
                                    groupClassName: 'col-md-12'
                                }}
                                key = "a"
                            />
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'B',
                                    checked: false,
                                    name: "a_ecraser",
                                    value: 'B',
                                    groupClassName: 'col-md-12'
                                }}
                                key = "b"/>
                        </RadioGroup>

                        <Row>
                            <InputCheckboxEditable
                                key={'bty'}
                                attributes={{
                                    label: 'check1',
                                    name: "check[]",
                                    value: 'check1',
                                    checked: true,
                                    htmlFor: 'form_test',
                                    groupClassName: 'col-md-2'
                                }}
                                editable={editable} />

                            <InputCheckboxEditable
                                key={'btz'}
                                attributes={{
                                    label: 'check2',
                                    name: "check[]",
                                    value: 'check2',
                                    checked: true,
                                    htmlFor: 'form_test',
                                    groupClassName: 'col-md-2'
                                }}
                                editable={editable} />
                        </Row>
                        <InputDateEditable
                            attributes={{
                                label: 'Champ date editable',
                                name: 'date',
                                value: '2015-02-23',
                                htmlFor: 'form_test',
                                required: true,
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <InputTimeEditable
                            attributes={{
                                label: 'Champ time editable',
                                name: 'time_field',
                                value: '10:00:25',
                                htmlFor: 'form_test',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-2',
                                groupClassName: 'row'
                            }}
                            editable={editable} />

                        <Button bsStyle="primary" onClick={this.toggleModal1}>Modal 1</Button>

                        <Button bsStyle="success" onClick={this.toggleModal2}>Modal 2</Button>
                    </Form>
                </div>
            )
        }
    })
    ;
module.exports = ReactPageTest;

// Creates a DataStore
var storeTest = Reflux.createStore({

    // Initial setup
    init: function () {
        this.listenToMany(Actions.validation);
    },

    /**
     * Appelé apprès la sélection du formulaire dans le listener de l'action 'submit_form'
     * @param data
     */
    onModal1_save: function (data) {
        console.log('Save MODAL 1 : %o', $(data).serializeArray());
        this.trigger({
            isModalOpen: false
        });
    },

    /**
     * Appelé apprès la sélection du formulaire dans le listener de l'action 'submit_form'
     * @param data
     */
    onModal2_save: function (data) {
        console.log('Save MODAL 2 : %o', $(data).serializeArray());
        this.trigger({
            isModalOpen: false
        });
    },

    /**
     * Appellée par le mixin form verif
     */
    onSubmit_form: function (domNode, idForm) {
        console.group('------ Submit form ');
        console.log('domNode : %o', domNode);
        console.log('idForm : %o', idForm);
        switch (idForm) {
            case "form_modal_test_1":
                this.onModal1_save(domNode);
                break;
            case "form_modal_test_2":
                this.onModal2_save(domNode);
                break;
            default:
                var f = form_data_helper('form_test', 'POST');
                ////console.log('DATA: %o',fData);
                //var f = $('#form_test').serializeArray();
                //f.push({name: '_token', value: $('#_token').val()});
                //console.log('DATA sur validation  %o', f);


                $.ajax({
                    url: BASE_URI + 'post_dump',
                    data: f,
                    dataType: 'json',
                    context: this,
                    method: 'POST',
                    async: false,
                    processData: false,
                    contentType: false,
                    success: function (good) {
                    },

                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }
                });
                break;
        }
        console.groupEnd();
    },
    /**
     * onChange de n'importe quel élément du FORM
     * @param obj: {name, value, form}
     */
    onForm_field_changed: function (obj) {
        console.log('CHANGED ' + obj.name + ': ' + obj.value);
        if (obj.name == 'select') {
            this.trigger({select: obj.value});
        }
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     */
    onForm_field_verif: function (obj) {
        console.log('VERIF ' + obj.name + ': ' + obj.value);

    }
});