/***********************/
var React = require('react/addons');
var BootstrapMenu = require('bootstrap-menu');
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
        viewEvents: [{date:(new Date).toISOString(),event:"state","class":"view",ID:2,state:"normal",count:60,occupied:40,free:60},{date:(new Date).toISOString(),event:"state","class":"view",ID:3,state:"normal",count:7,occupied:8,free:7},{date:(new Date).toISOString(),event:"state","class":"view",ID:4,state:"normal",count:2,occupied:8,free:10},{date:(new Date).toISOString(),event:"state","class":"view",ID:2,state:"normal",count:10,occupied:90,free:10},{date:(new Date).toISOString(),event:"state","class":"view",ID:6,state:"normal",count:0,occupied:0,free:"30"},{date:(new Date).toISOString(),event:"state","class":"view",ID:3,state:"normal",count:0,occupied:0,free:"full"},{date:(new Date).toISOString(),event:"state","class":"view",ID:4,state:"normal",count:0,occupied:0,free:"empty"},{date:(new Date).toISOString(),event:"state","class":"view",ID:5,state:"normal",count:10,occupied:90,free:38},{date:(new Date).toISOString(),event:"state","class":"view",ID:6,state:"normal",count:0,occupied:0,free:"full"}],
        sensorEvents: [
            {
                "class": "sensor",
                "date": "2015-09-03T12:24:17",
                "event": "state",
                "ID": 93,
                "state": "online",
                "sense": "free"
            },
            {
                "date": "2015-09-03T12:25:45",
                "ID": 93,
                "sense": "occupied"
            }
        ],

        events: [{dfu:!1,"class":"sensor",sense:"free",date:"2015-09-03T12:23:55",event:"state",ID:18,supply:63500,state:"probing"},{dfu:!1,sense:"free",ID:19,supply:63e3,state:"probing"},{dfu:!1,sense:"free",ID:20,supply:62500,state:"probing"},{dfu:!1,sense:"free",ID:21,supply:62e3,state:"probing"},{dfu:!1,sense:"free",ID:22,supply:61500,state:"probing"},{dfu:!1,sense:"free",ID:23,supply:61e3,state:"probing"},{dfu:!1,sense:"occupied",ID:24,supply:60500,state:"probing"},{dfu:!1,sense:"free",ID:25,supply:6e4,state:"probing"},{dfu:!1,sense:"free",ID:26,supply:59500,state:"probing"},{dfu:!1,sense:"occupied",ID:27,supply:59e3,state:"probing"},{dfu:!1,sense:"free",ID:28,supply:58500,state:"probing"},{dfu:!1,sense:"free",ID:29,supply:58e3,state:"probing"},{dfu:!1,sense:"free",ID:30,supply:57500,state:"probing"},{dfu:!1,sense:"free",ID:31,supply:57e3,state:"probing"},{dfu:!1,sense:"free",ID:32,supply:56500,state:"probing"},{dfu:!1,sense:"free",ID:33,supply:56e3,state:"probing"},{dfu:!1,sense:"free",ID:34,supply:55500,state:"probing"},{dfu:!1,sense:"free",ID:35,supply:55e3,state:"probing"},{dfu:!1,sense:"free",ID:36,supply:54500,state:"probing"},{dfu:!1,sense:"free",ID:37,supply:54e3,state:"probing"},{dfu:!1,sense:"occupied",ID:38,supply:53500,state:"probing"},{dfu:!1,sense:"free",ID:39,supply:53e3,state:"probing"},{dfu:!1,sense:"free",ID:40,supply:52500,state:"probing"},{dfu:!1,sense:"free",ID:41,supply:52e3,state:"probing"},{dfu:!1,sense:"occupied",ID:42,supply:51500,state:"probing"},{dfu:!1,sense:"occupied",ID:43,supply:51e3,state:"probing"},{dfu:!1,sense:"free",ID:44,supply:50500,state:"probing"},{dfu:!1,sense:"occupied",ID:45,supply:5e4,state:"probing"},{dfu:!1,sense:"occupied",ID:46,supply:49500,state:"probing"},{dfu:!1,sense:"free",ID:47,supply:49e3,state:"probing"},{dfu:!1,sense:"occupied",ID:48,supply:48500,state:"probing"},{dfu:!1,sense:"free",ID:49,supply:48e3,state:"probing"},{dfu:!1,sense:"free",ID:50,supply:47500,state:"probing"},{dfu:!1,sense:"occupied",ID:51,supply:47e3,state:"probing"},{dfu:!1,sense:"free",ID:52,supply:46500,state:"probing"},{dfu:!1,sense:"free",ID:53,supply:46e3,state:"probing"},{dfu:!1,sense:"free",ID:54,supply:45500,state:"probing"},{dfu:!1,sense:"free",ID:55,supply:45e3,state:"probing"},{dfu:!1,sense:"occupied",ID:56,supply:44500,state:"probing"},{dfu:!1,sense:"free",ID:57,supply:44e3,state:"probing"},{dfu:!1,sense:"free",ID:58,supply:43500,state:"probing"},{dfu:!1,sense:"occupied",ID:59,supply:43e3,state:"probing"},{dfu:!1,sense:"free",ID:60,supply:42500,state:"probing"},{dfu:!1,sense:"occupied",ID:61,supply:42e3,state:"probing"},{dfu:!1,sense:"occupied",ID:62,supply:41500,state:"probing"},{dfu:!1,sense:"occupied",ID:63,supply:72e3,state:"probing"},{dfu:!1,sense:"occupied",ID:64,supply:71500,state:"probing"},{dfu:!1,sense:"occupied",ID:65,supply:71e3,state:"probing"},{dfu:!1,sense:"occupied",ID:66,supply:70500,state:"probing"},{dfu:!1,sense:"occupied",ID:67,supply:7e4,state:"probing"},{dfu:!1,"class":"sensor",sense:"free",date:"2015-09-03T12:23:55",event:"state",ID:68,supply:69500,state:"probing"},{dfu:!1,sense:"free",ID:69,supply:69e3,state:"probing"},{dfu:!1,sense:"free",ID:70,supply:68500,state:"probing"},{dfu:!1,sense:"occupied",ID:71,supply:68e3,state:"probing"},{dfu:!1,sense:"occupied",ID:72,supply:67500,state:"probing"},{dfu:!1,sense:"free",ID:73,supply:67e3,state:"probing"},{dfu:!1,sense:"occupied",ID:74,supply:66500,state:"probing"},{dfu:!1,sense:"occupied",ID:75,supply:66e3,state:"probing"},{dfu:!1,sense:"occupied",ID:76,supply:65500,state:"probing"},{dfu:!1,sense:"free",ID:77,supply:65e3,state:"probing"},{dfu:!1,sense:"free",ID:78,supply:64500,state:"probing"},{dfu:!1,sense:"free",ID:79,supply:64e3,state:"probing"},{dfu:!1,sense:"free",ID:80,supply:63500,state:"probing"},{dfu:!1,sense:"occupied",ID:81,supply:63e3,state:"probing"},{dfu:!1,sense:"free",ID:82,supply:62500,state:"probing"},{dfu:!1,sense:"occupied",ID:83,supply:62e3,state:"probing"},{dfu:!1,sense:"free",ID:84,supply:61500,state:"probing"},{dfu:!1,sense:"occupied",ID:85,supply:61e3,state:"probing"},{dfu:!1,sense:"occupied",ID:86,supply:60500,state:"probing"},{dfu:!1,sense:"free",ID:87,supply:6e4,state:"probing"},{dfu:!1,sense:"free",ID:88,supply:59500,state:"probing"},{dfu:!1,sense:"free",ID:89,supply:59e3,state:"probing"},{dfu:!1,sense:"free",ID:90,supply:58500,state:"probing"},{dfu:!1,sense:"free",ID:91,supply:58e3,state:"probing"},{dfu:!1,sense:"free",ID:92,supply:57500,state:"probing"},{dfu:!1,sense:"free",ID:93,supply:57e3,state:"probing"},{dfu:!1,sense:"free",ID:94,supply:56500,state:"probing"},{dfu:!1,sense:"free",ID:95,supply:56e3,state:"probing"},{dfu:!1,sense:"free",ID:96,supply:55500,state:"probing"},{dfu:!1,sense:"free",ID:97,supply:55e3,state:"probing"},{dfu:!1,sense:"free",ID:98,supply:54500,state:"probing"},{dfu:!1,sense:"free",ID:99,supply:54e3,state:"probing"},{dfu:!1,sense:"free",ID:100,supply:53500,state:"probing"},{dfu:!1,sense:"free",ID:101,supply:53e3,state:"probing"},{dfu:!1,sense:"free",ID:102,supply:52500,state:"probing"},{dfu:!1,sense:"free",ID:103,supply:52e3,state:"probing"},{dfu:!1,sense:"free",ID:104,supply:51500,state:"probing"},{dfu:!1,sense:"free",ID:105,supply:51e3,state:"probing"},{dfu:!1,sense:"free",ID:106,supply:50500,state:"probing"},{dfu:!1,sense:"free",ID:107,supply:5e4,state:"probing"},{dfu:!1,sense:"free",ID:108,supply:49500,state:"probing"},{dfu:!1,sense:"free",ID:109,supply:49e3,state:"probing"},{dfu:!1,sense:"free",ID:110,supply:48500,state:"probing"},{dfu:!1,sense:"free",ID:111,supply:48e3,state:"probing"},{dfu:!1,sense:"free",ID:112,supply:47500,state:"probing"},{dfu:!1,sense:"free",ID:113,supply:47e3,state:"probing"},{dfu:!1,sense:"free",ID:114,supply:46500,state:"probing"},{dfu:!1,sense:"free",ID:115,supply:46e3,state:"probing"},{dfu:!1,sense:"free",date:"2015-09-03T12:23:56",ID:116,supply:45500,state:"probing"},{dfu:!1,sense:"free",ID:117,supply:45e3,state:"probing"},{dfu:!1,"class":"sensor",sense:"free",date:"2015-09-03T12:23:56",event:"state",ID:118,supply:44500,state:"probing"},{dfu:!1,sense:"free",ID:119,supply:44e3,state:"probing"},{dfu:!1,sense:"free",ID:120,supply:43500,state:"probing"},{dfu:!1,sense:"free",ID:121,supply:43e3,state:"probing"},{dfu:!1,sense:"free",ID:122,supply:42500,state:"probing"},{dfu:!1,sense:"free",ID:123,supply:42e3,state:"probing"},{dfu:!1,sense:"free",ID:124,supply:41500,state:"probing"},{dfu:!1,sense:"free",ID:125,supply:41e3,state:"probing"},{date:"2015-09-03T12:23:57",ID:1,state:"online"},{ID:2,state:"online"},{ID:3,state:"online"},{date:"2015-09-03T12:23:58",ID:4,state:"online"},{ID:5,state:"online"},{ID:6,state:"online"},{ID:7,state:"online"},{ID:8,state:"online"},{ID:9,state:"online"},{ID:10,state:"online"},{date:"2015-09-03T12:23:59",ID:11,state:"online"},{ID:12,state:"online"},{ID:13,state:"online"},{ID:14,state:"online"},{ID:15,state:"online"},{ID:16,state:"online"},{date:"2015-09-03T12:24:00",ID:17,state:"online"},{ID:18,state:"online"},{ID:19,state:"online"},{ID:20,state:"online"},{ID:21,state:"online"},{ID:22,state:"online"},{date:"2015-09-03T12:24:02",ID:23,state:"online"},{ID:24,state:"online"},{ID:25,state:"online"},{ID:26,state:"online"},{ID:27,state:"online"},{date:"2015-09-03T12:24:03",ID:28,state:"online"},{ID:29,state:"online"},{ID:30,state:"online"},{ID:31,state:"online"},{ID:32,state:"online"},{ID:33,state:"online"},{ID:34,state:"online"},{date:"2015-09-03T12:24:04",ID:35,state:"online"},{ID:36,state:"online"},{ID:37,state:"online"},{ID:38,state:"online"},{ID:39,state:"online"},{ID:40,state:"online"},{ID:41,state:"online"},{date:"2015-09-03T12:24:05",ID:42,state:"online"},{"class":"sensor",date:"2015-09-03T12:24:05",event:"state",ID:43,state:"online"},{ID:44,state:"online"},{ID:45,state:"online"},{ID:46,state:"online"},{date:"2015-09-03T12:24:07",ID:47,state:"online"},{ID:48,state:"online"},{ID:49,state:"online"},{ID:50,state:"online"},{date:"2015-09-03T12:24:08",ID:51,state:"online"},{ID:52,state:"online"},{ID:53,state:"online"},{ID:54,state:"online"},{ID:55,state:"online"},{ID:56,state:"online"},{date:"2015-09-03T12:24:09",ID:57,state:"online"},{ID:58,state:"online"},{ID:59,state:"online"},{ID:60,state:"online"},{ID:61,state:"online"},{ID:62,state:"online"},{date:"2015-09-03T12:24:10",ID:63,state:"online"},{ID:64,state:"online"},{ID:65,state:"online"},{ID:66,state:"online"},{ID:67,state:"online"},{date:"2015-09-03T12:24:12",ID:68,state:"online"},{ID:69,state:"online"},{ID:70,state:"online"},{ID:71,state:"online"},{date:"2015-09-03T12:24:13",ID:72,state:"online"},{ID:73,state:"online"},{ID:74,state:"online"},{ID:75,state:"online"},{ID:76,state:"online"},{ID:77,state:"online"},{date:"2015-09-03T12:24:14",ID:78,state:"online"},{ID:79,state:"online"},{ID:80,state:"online"},{ID:81,state:"online"},{ID:82,state:"online"},{ID:83,state:"online"},{ID:84,state:"online"},{date:"2015-09-03T12:24:15",ID:85,state:"online"},{ID:86,state:"online"},{ID:87,state:"online"},{ID:88,state:"online"},{ID:89,state:"online"},{ID:90,state:"online"},{date:"2015-09-03T12:24:16",ID:91,state:"online"},{date:"2015-09-03T12:24:17",ID:92,state:"online"},{"class":"sensor",date:"2015-09-03T12:24:17",event:"state",ID:93,state:"online"},{ID:94,state:"online"},{date:"2015-09-03T12:24:18",ID:95,state:"online"},{ID:96,state:"online"},{ID:97,state:"online"},{ID:98,state:"online"},{ID:99,state:"online"},{ID:100,state:"online"},{ID:101,state:"online"},{date:"2015-09-03T12:24:19",ID:102,state:"online"},{ID:103,state:"online"},{ID:104,state:"online"},{ID:105,state:"online"},{ID:106,state:"online"},{ID:107,state:"online"},{ID:108,state:"online"},{date:"2015-09-03T12:24:20",ID:109,state:"online"},{ID:110,state:"online"},{ID:111,state:"online"},{ID:112,state:"online"},{ID:113,state:"online"},{ID:114,state:"online"},{date:"2015-09-03T12:24:21",ID:115,state:"online"},{ID:116,state:"online"},{date:"2015-09-03T12:24:22",ID:117,state:"online"},{ID:118,state:"online"},{date:"2015-09-03T12:24:23",ID:119,state:"online"},{ID:120,state:"online"},{ID:121,state:"online"},{ID:122,state:"online"},{ID:123,state:"online"},{ID:124,state:"online"},{ID:125,state:"online"}],
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

        busEnumData : [{index:1,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTThHg+MME7Pi7KpqGM44Co=",softwareVersion:"1.2.3.4",leg:1},{index:2,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcbiHfIz00QsuZq6yC8XzdM=",softwareVersion:"1.2.3.4",leg:1},{index:3,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbQwOWWOjSkLEvPDY5iOzlXc=",softwareVersion:"1.2.3.4",leg:1},{index:4,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVLoGvqTbUcYurDSSWcZM88=",softwareVersion:"1.2.3.4",leg:1},{index:5,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYBtIFCYU01PgOvWzUceDZs=",softwareVersion:"1.2.3.4",leg:1},{index:6,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbc36n9fp60yFh8YYfO2QUTA=",softwareVersion:"1.2.3.4",leg:1},{index:7,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYA4JSVylEymrHOgDjAvols=",softwareVersion:"1.2.3.4",leg:1},{index:8,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfT6bH9hwE76iE3OzDhGyjM=",softwareVersion:"1.2.3.4",leg:1},{index:9,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYhiyQpsY00Aj/UCQn1iJ/I=",softwareVersion:"1.2.3.4",leg:1},{index:10,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfU9dG3fAkkoh0uTUUUy2H8=",softwareVersion:"1.2.3.4",leg:1},{index:11,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbclrZP8R7keKmeMBmbMgVZc=",softwareVersion:"1.2.3.4",leg:1},{index:12,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbS7fHxzOrUUNhEZzRWIy1Bw=",softwareVersion:"1.2.3.4",leg:1},{index:13,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbezFbF+9Dkm3onx4YkkaCoc=",softwareVersion:"1.2.3.4",leg:1},{index:14,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbUlwsvUMO0KAj/wd+VUFvAU=",softwareVersion:"1.2.3.4",leg:1},{index:15,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVaf+t6Oc02uqtCsiiDsykw=",softwareVersion:"1.2.3.4",leg:1},{index:16,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbe5mQvVm4U6vtu9ImOJ7rMc=",softwareVersion:"1.2.3.4",leg:1},{index:17,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXGa1Y2GHkyfnlhWyxkygwY=",softwareVersion:"1.2.3.4",leg:1},{index:18,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXxhd/6olE7otUdSVb0/Onc=",softwareVersion:"1.2.3.4",leg:1},{index:19,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbd3/V/Z2Uk/dn6H60BI4slM=",softwareVersion:"1.2.3.4",leg:1},{index:20,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYCmWAE370X5uazlbjOyz9A=",softwareVersion:"1.2.3.4",leg:1},{index:21,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVb69UkKQEMEsiin773bqYc=",softwareVersion:"1.2.3.4",leg:1},{index:22,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbGcBqwQ0k23vsO8Fvqexuk=",softwareVersion:"1.2.3.4",leg:1},{index:23,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWVe6ECU/0U6sS0lfNpjtmM=",softwareVersion:"1.2.3.4",leg:1},{index:24,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbc6ilzAIiE0TmK6ZJJGbxFM=",softwareVersion:"1.2.3.4",leg:1},{index:25,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdk9jkm0skkCu/qttjkhW98=",softwareVersion:"1.2.3.4",leg:1},{index:26,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeksvcSa2Uzgn968jAJCivc=",softwareVersion:"1.2.3.4",leg:1},{index:27,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbROZpC4TskNRjlwJ6civ2w4=",softwareVersion:"1.2.3.4",leg:1},{index:28,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbaKxWTKpbkvAmzYm2g7vxE4=",softwareVersion:"1.2.3.4",leg:1},{index:29,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVe8Zs6tA0GOmLqbWQ9WT6g=",softwareVersion:"1.2.3.4",leg:1},{index:30,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbZiap6YMXEFemonraISqxg8=",softwareVersion:"1.2.3.4",leg:1},{index:31,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbS+ZaHHjuEu0kul1VOeXcss=",softwareVersion:"1.2.3.4",leg:1},{index:32,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTfDrjmCOE7Rnakj1YCeeFg=",softwareVersion:"1.2.3.4",leg:1},{index:33,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcij6Dunq05WmhclhVVs3D0=",softwareVersion:"1.2.3.4",leg:1},{index:34,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdj1OJoNR0a3ikF3tZB9yFc=",softwareVersion:"1.2.3.4",leg:1},{index:35,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeceTis8jEKSoECO+1Ke9dQ=",softwareVersion:"1.2.3.4",leg:1},{index:36,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbQxpZf0lEEOeo+QF8EpxH9U=",softwareVersion:"1.2.3.4",leg:1},{index:37,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfOQl28kykSunS8p36HF+58=",softwareVersion:"1.2.3.4",leg:1},{index:38,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYIbjuj50knaukr+mnAmZjY=",softwareVersion:"1.2.3.4",leg:1},{index:39,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbteKvu6ZEwokPGc0FMXi60=",softwareVersion:"1.2.3.4",leg:1},{index:40,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbRLALkYkUkTCsxfNOCi62mg=",softwareVersion:"1.2.3.4",leg:1},{index:41,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbRC6U5XegEm7kr3le/ZCag8=",softwareVersion:"1.2.3.4",leg:1},{index:42,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbgoYxpAmEAnksaFt0qvdks=",softwareVersion:"1.2.3.4",leg:1},{index:43,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdhzecxMgkUyjIRgV6jx+1M=",softwareVersion:"1.2.3.4",leg:1},{index:44,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbRtXbwhJdEJWoXk/e8vvRUA=",softwareVersion:"1.2.3.4",leg:1},{index:45,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbaO9M3YQNURfpQvxwDIe/sA=",softwareVersion:"1.2.3.4",leg:1},{index:46,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeu9HZLCUUogrXCITPKlly0=",softwareVersion:"1.2.3.4",leg:1},{index:47,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeKmJHq4oUdYvkXVsssVXIc=",softwareVersion:"1.2.3.4",leg:1},{index:48,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbZoCZZC7Rkptg/Me4REofkg=",softwareVersion:"1.2.3.4",leg:1},{index:49,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTWbKmrCBkPTsH908MeO/xM=",softwareVersion:"1.2.3.4",leg:1},{index:50,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpba6fPKtTREZsreheZ7D+OkE=",softwareVersion:"1.2.3.4",leg:1},{index:51,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbQPXRi6pJ08ZhUWq0e8IaKQ=",softwareVersion:"1.2.3.4",leg:1},{index:52,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdqzaWG9d0AwkDmHfMd7mlk=",softwareVersion:"1.2.3.4",leg:1},{index:53,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbddbB7BLN0OQnpFxtiiARqQ=",softwareVersion:"1.2.3.4",leg:1},{index:54,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbUI3JATT4E/kpwTDiYc0sn8=",softwareVersion:"1.2.3.4",leg:1},{index:55,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbX6rdmQlb0pVntJwrFpAN/s=",softwareVersion:"1.2.3.4",leg:1},{index:56,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcvxRSTkeEzxisE+NuD8QUY=",softwareVersion:"1.2.3.4",leg:1},{index:57,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWL4HIQyK0AzmF6vwktfs6I=",softwareVersion:"1.2.3.4",leg:1},{index:58,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeR18QkHfULHv+6OwRTwpgc=",softwareVersion:"1.2.3.4",leg:1},{index:59,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbUR/zSWPh0P2lMIq7trOwpM=",softwareVersion:"1.2.3.4",leg:1},{index:60,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbUSpFXXYn0VogYOd8Vlgjv0=",softwareVersion:"1.2.3.4",leg:1},{index:61,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfDLjx9CnUUyria2CtdBurw=",softwareVersion:"1.2.3.4",leg:1},{index:62,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYTUYgMKGUAevmcludgp+GQ=",softwareVersion:"1.2.3.4",leg:1},{index:1,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTE1go9e80hfqK6nGdFBjoU=",softwareVersion:"1.2.3.4",leg:2},{index:2,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbahmhVq4TEdcjgi3wh3r7Ts=",softwareVersion:"1.2.3.4",leg:2},{index:3,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWDKkI/3fkoViwKbr8GzsYU=",softwareVersion:"1.2.3.4",leg:2},{index:4,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeht8W1+PEeOr4g31Q8fRf0=",softwareVersion:"1.2.3.4",leg:2},{index:5,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXexw0gPAUukmuLEZQUZGJ4=",softwareVersion:"1.2.3.4",leg:2},{index:6,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbar9JyyVN04PphEd+FzXenQ=",softwareVersion:"1.2.3.4",leg:2},{index:7,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbSaked1JV0yVonNykx+BFnU=",softwareVersion:"1.2.3.4",leg:2},{index:8,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWyGtzsC/Up+i49BCADu2L0=",softwareVersion:"1.2.3.4",leg:2},{index:9,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWgEdaOFm0QNgxExRGFZq4I=",softwareVersion:"1.2.3.4",leg:2},{index:10,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbduZvt5/yE5euT/UQ4V6HCo=",softwareVersion:"1.2.3.4",leg:2},{index:11,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbQ3irMvRCUOUiUT9D606o/0=",softwareVersion:"1.2.3.4",leg:2},{index:12,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbQQtv1W2kgnvAqQI+No3eY=",softwareVersion:"1.2.3.4",leg:2},{index:13,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfRr7iaJvUtIrZ1mI5NQJWs=",softwareVersion:"1.2.3.4",leg:2},{index:14,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcJ/OO4FrEc2vlF9uhZEauw=",softwareVersion:"1.2.3.4",leg:2},{index:15,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYinCOi81UkVtcB0RJD0zRw=",softwareVersion:"1.2.3.4",leg:2},{index:16,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXvT8kHgGkeTs2hzijDSJe8=",softwareVersion:"1.2.3.4",leg:2},{index:17,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdZjiXLnrkK4mack7k82TeU=",softwareVersion:"1.2.3.4",leg:2},{index:18,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbUu5rv0NLk6ksocdcSCo8pE=",softwareVersion:"1.2.3.4",leg:2},{index:19,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeIDtyCBlEefuwXDUAGvVCY=",softwareVersion:"1.2.3.4",leg:2},{index:20,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbaQ9WreyzkI0qc4dE0A89SY=",softwareVersion:"1.2.3.4",leg:2},{index:21,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcHKuA441UtQl35zKfRE6m0=",softwareVersion:"1.2.3.4",leg:2},{index:22,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbeT/75UI2kt6u9+lYm3TkyA=",softwareVersion:"1.2.3.4",leg:2},{index:23,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTz6HEGpUUYQqQaAPBnHONc=",softwareVersion:"1.2.3.4",leg:2},{index:24,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfMK5v64+kbfkB3OI53w6GM=",softwareVersion:"1.2.3.4",leg:2},{index:25,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbQiccnmjMEXxh2L/cgucH0Q=",softwareVersion:"1.2.3.4",leg:2},{index:26,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbb7WlXASQ0M9mKpG+Rv3YLM=",softwareVersion:"1.2.3.4",leg:2},{index:27,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbU0nnMdnEk2YutPkw9Avops=",softwareVersion:"1.2.3.4",leg:2},{index:28,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcy4Xl44vUy8sd8/ooUzUYM=",softwareVersion:"1.2.3.4",leg:2},{index:29,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbd4u/MAZUANgDTKeZbGi1I=",softwareVersion:"1.2.3.4",leg:2},{index:30,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbb1T/51IIE7qmQ4wz6cnVYY=",softwareVersion:"1.2.3.4",leg:2},{index:31,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYJpKnSx10GKthBlyCIS0hY=",softwareVersion:"1.2.3.4",leg:2},{index:32,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbSpbreEpG088r1BudhG4nKo=",softwareVersion:"1.2.3.4",leg:2},{index:33,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbX5J6mQtn0KUhalysgEM7Rk=",softwareVersion:"1.2.3.4",leg:2},{index:34,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcuRQimBq0qKuiXKwdrisHE=",softwareVersion:"1.2.3.4",leg:2},{index:35,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWVCcej1oE3+ppR+MIpO0iU=",softwareVersion:"1.2.3.4",leg:2},{index:36,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbW5gYG4kk0SslmudKumhM1o=",softwareVersion:"1.2.3.4",leg:2},{index:37,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbble/+ez80ZTvcYmXCz7328=",softwareVersion:"1.2.3.4",leg:2},{index:38,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbclCqFzl70grlvI/NJhhNMU=",softwareVersion:"1.2.3.4",leg:2},{index:39,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdD8PS4OaUJ8uNF9OcaoNOA=",softwareVersion:"1.2.3.4",leg:2},{index:40,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVqil4cP1EPIi4tgPCImklc=",softwareVersion:"1.2.3.4",leg:2},{index:41,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbV4qPW5yzkykgUkAvmOXTec=",softwareVersion:"1.2.3.4",leg:2},{index:42,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbYtnQEHmBEY7tfWt5u2Yje0=",softwareVersion:"1.2.3.4",leg:2},{index:43,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbX54C8utoUVfvLXx/5zu65w=",softwareVersion:"1.2.3.4",leg:2},{index:44,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdH0CAtF+U5esMlDc4uKXJU=",softwareVersion:"1.2.3.4",leg:2},{index:45,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVVjTORP8kGritYbmuMSlu8=",softwareVersion:"1.2.3.4",leg:2},{index:46,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbfoxnTNyEEoms++LM2trkAY=",softwareVersion:"1.2.3.4",leg:2},{index:47,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbRuztzLkOE8Gof69ks6PwgM=",softwareVersion:"1.2.3.4",leg:2},{index:48,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbe8TdfCEFkp5n5NlYg5v7Zo=",softwareVersion:"1.2.3.4",leg:2},{index:49,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbY69gesVPUPZoCoQDsL+R9A=",softwareVersion:"1.2.3.4",leg:2},{index:50,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbtcvUnP1U23sF/oWRwixXI=",softwareVersion:"1.2.3.4",leg:2},{index:51,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbafajGAwmECOtOLMxcDW4jc=",softwareVersion:"1.2.3.4",leg:2},{index:52,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbWD7py+zeU19ohRWkQ64dwE=",softwareVersion:"1.2.3.4",leg:2},{index:53,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbVfr6DIczkG3mEmN84NbZtg=",softwareVersion:"1.2.3.4",leg:2},{index:54,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXUGVGT6JktErnNx0ErIzIs=",softwareVersion:"1.2.3.4",leg:2},{index:55,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbTO2wpIqmEN4qGY7ovk+ET4=",softwareVersion:"1.2.3.4",leg:2},{index:56,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbcaqMJVf7kJEs4vAp8hKj4w=",softwareVersion:"1.2.3.4",leg:2},{index:57,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbNifbwiMkcVtXvC8cL8I+k=",softwareVersion:"1.2.3.4",leg:2},{index:58,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdVziPP1V0nyva9DoBEgSSo=",softwareVersion:"1.2.3.4",leg:2},{index:59,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbmefdkgtEU3mYk4g5WKwL8=",softwareVersion:"1.2.3.4",leg:2},{index:60,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbbN7RpV9fEapt4zQEP+difQ=",softwareVersion:"1.2.3.4",leg:2},{index:61,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbdzoOCK2jELAiieN/QjWVDA=",softwareVersion:"1.2.3.4",leg:2},{index:62,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbXGdfhvKDUNwq9SpPuYCRMs=",softwareVersion:"1.2.3.4",leg:2},{index:63,"class":"sensor",modelName:"UshrSim",address:0,ssn:"VVNpbV9T6KLEj0b9lY12j6E9ZCU=",softwareVersion:"1.2.3.4",leg:2}],

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
         * Prépare le message pour mettre des sensor à jour
         * @returns {{messageType: string, data: {ackID: number, list: *}}}
         */
        updateSensor: function () {

            var tab = _.cloneDeep(this.sensorEvents);

            return {
                "messageType": "eventData",
                "data": {
                    "ackID": tab.length,
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
         * Envoie le message pour mettre des sensors à jour
         */
        sendEventsSensor: function () {

            var msg = JSON.stringify(this.updateSensor());
            //console.log('message: %o', msg);
            //console.log('client: %o', this.clientWs);
            this.clientWs.send(msg);

        },

        /**
         * Bus Enum avec les data récupérés du controller de test
         */
        sendBusEnumTest: function () {

            var msg = JSON.stringify({
                "messageType" : "job",
                "data": {
                    "job" : "busEnum",
                    "class" : "bus",
                    "ID" : 1,
                    "state" : "test",
                    "param" : _.cloneDeep(this.busEnumData)
                }});
            this.clientWs.send(msg);
            console.log('sendBusEnumTest');
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
            var menu = new BootstrapMenu('.testContext', {
                //menuEvent: 'click',
                actions: [{
                    name: 'Action',
                    onClick: function () {
                        // run when the action is clicked
                    }
                }, {
                    name: 'Another action',
                    onClick: function () {
                        // run when the action is clicked
                    }
                }, {
                    name: 'A third action',
                    onClick: function () {
                        // run when the action is clicked
                    }
                }]
            });
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
                        <span className="testContext">
                            Test contextMenu
                        </span>
                        <h1>COMMUNICATION TOOL</h1>
                        <Button
                            onClick={function () {
                                // Parking id 1=> beauvais, 3 => annecy
                                // Connexion controller
                                supervision_helper.init(0, 0, 3, 0, function OK(clientWs) {
                                        this.clientWs = clientWs;
                                        console.log('Connecté');
                                    }.bind(this),
                                    function KO(err) {
                                        console.error('ERREUR WS');
                                    }.bind(this)
                                );
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

                        <Button
                            onClick={this.sendEventsSensor}>
                            Sensor events
                        </Button>

                        <Button
                            onClick={this.sendBusEnumTest}>
                            Simulate bus enum
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