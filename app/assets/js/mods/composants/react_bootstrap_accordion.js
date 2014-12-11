/**
 * Created by yann on 09/12/2014.
 *
 * Composant entourant plusieurs accordéons (comme le menu de gauche par exemple)
 * @param id: id du groupe de panels
 */
var PanelGroup = React.createClass({
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {
        id: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    render: function () {
        // Ajout d'une classe perso
        var classes = "panel-group sidebar-accordion " + (this.props.className ? this.props.className : '');


        var children = _.map(this.props.children, function (child) {
            var newProps = {
                groupId: this.props.id,
                key: child.key
            };
            var temp = React.addons.cloneWithProps(child, newProps);
            return temp;
        }, this);

        console.log('ReactPanelGroup AprèsMaps');
        console.log(children);
        return (
            <div {...this.props} className={classes}>
                {children}
            </div>
        )
    }
});

/**
 * Created by yann on 09/12/2014.
 *
 * Composant Panel, c'est un item dans un group de panel
 * Il contient un PanelHeader et un PanelCollapse
 *
 * @param groupId : Id du panel-group
 * @param id : id du panel (utilisé pour lier le header au collapse)
 * @param title : Titre affiché dans le header du panel
 * @param url : url du lien dans le header du panel
 * @param collapseData : Tableau de données pour créer le menu déroulant (Voir le composant PanelCollapse pour la structure)
 * @param icon : icone a afficher dans le header du panel
 */
var Panel = React.createClass({

    propTypes: {
        groupId: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        collapseData: React.PropTypes.array,
        icon: React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {collapseData: []};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var collapseId= this.props.collapseData.length > 0 ? {collapseId:this.props.id} : {};
        // Ajout d'une classe perso
        var classes = "panel panel-default " + (this.props.className ? this.props.className : '');
        return (
            <div {...this.props} id={"panel-"+this.props.id} className={classes}>
                <PanelHeading groupId={this.props.groupId} title={this.props.title} url={this.props.url}
                {...collapseId} icon={this.props.icon} />
                <PanelCollapse id={this.props.id} dataItems={this.props.collapseData} />
            </div>
        )
    }
});

/**
 * Created by yann on 09/12/2014.
 *
 * Header d'un Panel
 * @param groupId : id du PanelGroup parent
 * @param title : Titre a afficher dans le lien
 * @param url : url du lien
 * @param collapseId : id du PanelCollapse correspondant à ce PanelHeading (non obligatoire si non collapsable)
 * @param icon : Icon à accicher
 */
var PanelHeading = React.createClass({

    propTypes: {
        groupId: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        collapseId: React.PropTypes.string,
        icon: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {icon: "", collapseId: ""};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var icon = this.props.icon != "" ? <span className={"glyphicon " + this.props.icon}></span> : '';
        var collapse = ((this.props.collapseId != "") ? (<a data-parent={"#"+this.props.groupId} data-toggle="collapse" href={"#"+this.props.collapseId}>
            <span className="glyphicon glyphicon-chevron-down pull-right" />
        </a>) : "");
        return (
            <div className="panel-heading">
                <h4 className="panel-title">
                    <a data-parent={"#"+this.props.groupId} href={this.props.url}>
                    {icon} {this.props.title} {collapse}
                    </a>
                </h4>
            </div>
        );
    }
});

/**
 * Created by yann on 09/12/2014.
 *
 * Partie cachée d'un Panel
 * @param name : nom a afficher dans le composant
 * @param dataItems : un tableau contenant les données à afficher dans le tableau dépliant:
 *      [
 *          {
 *              id: 4
 *              url: "http://totolafritte.fr/",
 *              traduction: "Toto Lafritte",
 *              icon: "glyphicon-tasks"
 *          },
 *          {
 *              id: 5
 *              url: "http://totolagoutte.fr/",
 *              traduction: "Toto Lagoutte",
 *              icon: "glyphicon-user"
 *          }
 *      ]
 *
 */
var PanelCollapse = React.createClass({

    propTypes: {
        id: React.PropTypes.string.isRequired,
        dataItems: React.PropTypes.array
    },

    getDefaultProps: function () {
        return {dataItems: []};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var items = [];

        // CRÉATION DES ITEMS DU COLLAPSE EN FONCTION DES DONNÉES
        this.props.dataItems.forEach(function (item, i) {
            items.push(<TrCollapse key={item.id} url={item.url} traduction={item.traduction} icon={item.icon} />)
        }, this);

        return (
            <div className="panel-collapse collapse" id={this.props.id}>
                <div className="panel-body">
                    <table className="table">
                        {items}
                    </table>
                </div>
            </div>
        )
    }
});

/**
 * Created by yann on 09/12/2014.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var TrCollapse = React.createClass({

    propTypes: {
        url: React.PropTypes.string.isRequired,
        traduction: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var icon = this.props.icon != "" ? <span className={"glyphicon " + this.props.icon}></span> : '';
        console.log(this.props);

        return (<tr>
            <td>
                <a href={this.props.url} title={this.props.traduction}>{icon} {this.props.traduction}</a>
            </td>
        </tr>)
    }
});


module.exports.PanelGroup = PanelGroup;
module.exports.Panel = Panel;
module.exports.PanelHeading = PanelHeading;
module.exports.PanelCollapse = PanelCollapse;
