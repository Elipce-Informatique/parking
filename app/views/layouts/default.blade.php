@extends('...structure')

@section('struct_css')
    @yield('css')
@stop

@section('struct_content')
    <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <!-- Menu header de l'application -->
    <nav id="menu-top" class="navbar navbar-inverse navbar-fixed-top" role="navigation">

    </nav>
    <!-- Contenu de l'application -->
    <div class="container-fluid">
        <div class="row">
            <div id="menu-left" class="col-sm-3 col-md-2 sidebar">


               <div class="panel-group sidebar-accordion" id="accordion">
                   <div class="panel panel-default">
                       <div class="panel-heading">
                           <h4 class="panel-title">
                               <a data-parent="#accordion" href="http://127.0.0.1/elipce_workflow/utilisateur"><span class="glyphicon glyphicon-user">
                               </span>Utilisateurs</a>
                           </h4>
                       </div>

                   </div>
                   <div class="panel panel-default">
                       <div class="panel-heading">
                           <h4 class="panel-title">
                               <a href="http://127.0.0.1/elipce_workflow/profils" ><span class="glyphicon glyphicon-th"></span>Profils</a>
                               <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"><span class="glyphicon glyphicon-chevron-down pull-right">
                               </span></a>
                           </h4>
                       </div>
                       <div id="collapseTwo" class="panel-collapse collapse">
                           <div class="panel-body">
                               <table class="table">
                                   <tr>
                                       <td>
                                           <a href="http://www.jquery2dotnet.com">Orders</a> <span class="label label-success">$ 320</span>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td>
                                           <a href="http://www.jquery2dotnet.com">Invoices</a>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td>
                                           <a href="http://www.jquery2dotnet.com">Shipments</a>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td>
                                           <a href="http://www.jquery2dotnet.com">Tex</a>
                                       </td>
                                   </tr>
                               </table>
                           </div>
                       </div>
                   </div>

               </div>


            </div>
            <div  id="content" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                @yield('content')
            </div>
        </div>
    </div>
@stop

@section('struct_scripts')
    <script type="text/javascript" src="{{URL::asset('/public/js/global/menu.app.js')}}"></script>
    @yield('scripts')
@stop
