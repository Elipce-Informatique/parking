
$(function(){

   
   
        var oDataTable = $('#tab_users').DataTable({
                destroy: true,
                responsive: true,
                "language": {
                    "sProcessing":     Lang.get('global.datatable.sProcessing'),
                    "sSearch":         Lang.get('global.datatable.sSearch'),
                    "sLengthMenu":     Lang.get('global.datatable.sLengthMenu'),
                    "sInfo":           Lang.get('global.datatable.sInfo'),
                    "sInfoEmpty":      Lang.get('global.datatable.sInfoEmpty'),
                    "sInfoFiltered":   Lang.get('global.datatable.sInfoFiltered'),
                    "sInfoPostFix":    Lang.get('global.datatable.sInfoPostFix'),
                    "sLoadingRecords": Lang.get('global.datatable.sLoadingRecords'),
                    "sZeroRecords":    Lang.get('global.datatable.sZeroRecords'),
                    "sEmptyTable":     Lang.get('global.datatable.sEmptyTable'),
                    "oPaginate": {
                        "sFirst":      Lang.get('global.datatable.oPaginate.sFirst'),
                        "sPrevious":   Lang.get('global.datatable.oPaginate.sPrevious'),
                        "sNext":       Lang.get('global.datatable.oPaginate.sNext'),
                        "sLast":       Lang.get('global.datatable.oPaginate.sLast')
                    },
                    "oAria": {
                        "sSortAscending":  Lang.get('global.datatable.oAria.sSortAscending'),
                        "sSortDescending": Lang.get('global.datatable.oAria.sSortDescending')
                    }
				}
        });
        // Tableau à entete fixe
        new $.fn.dataTable.FixedHeader( oDataTable,{
            "offsetTop": 0
        });
    
    
    
    
   
});

