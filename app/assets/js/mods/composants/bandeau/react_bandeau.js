/**
 * @param string titre : Titre du bandeau
 * @param string sousTitre : sous titre du bandeau (En gris en petit à coté du titre)
 * @param number tailleTitre : entier entre 1 et 6 taille du titre (de h1 à h6)
 * @param function onRetour : Fonction à exécuter sur click du bouton retour. Pas de bouton retour si non défini
 * @param array btnList : Liste des boutons, tableau d'objet avec chaque objet au format suivant:
 * {
 *      libelle : "Enregistrer",
 *      style: "success",
 *      icon: "plus-sign",  // VOIR DOC BOOTSTRAP ET NE PAS METTRE GLYPHICON DEVANT
 *      attrs: {disabled: true},
 *      evts: {onClick: function}
 * }
 */

var Button = ReactB.Button;
var ButtonToolbar = ReactB.ButtonToolbar;
var ButtonGroup = ReactB.ButtonGroup;
var Glyphicon = ReactB.Glyphicon;
var Col = ReactB.Col;
var Row = ReactB.Row;

var ReactBandeau = React.createClass({

    propTypes: {
        titre: React.PropTypes.string.isRequired,
        sousTitre: React.PropTypes.string,
        tailleTitre: React.PropTypes.number,
        onRetour: React.PropTypes.func,
        btnList: React.PropTypes.array
    },

    /**
     * Les props par défaut
     */
    getDefaultProps: function () {
        return {
            sousTitre: "",
            tailleTitre: 3,
            btnList: []
        };
    },

    getInitialState: function () {
        return {};
    },


    /**
     * Avant le 1er affichage
     * @returns {undefined}
     */
    componentWillMount: function () {

    },
    /**
     * Après le 1er affichage
     * @returns {undefined}
     */
    componentDidMount: function () {

    },

    /**
     * Après chaque mise à jour DATA du tableau (forceupdate() ou setState())
     * @returns {undefined}
     */
    componentDidUpdate: function () {

    },

    render: function () {
        var titre, btnRetour = "", btnList;

        // CRÉATION DU TITRE
        var sousTitre = <small>  {this.props.sousTitre}</small>;
        switch (this.props.tailleTitre) {
            case 1:
                titre = <h1>{this.props.titre}
                    {sousTitre}
                </h1>;
                break;
            case 2:
                titre = <h2>{this.props.titre}
                    {sousTitre}
                </h2>;
                break;
            case 3:
                titre = <h3>{this.props.titre}
                    {sousTitre}
                </h3>;
                break;
            case 4:
                titre = <h4>{this.props.titre}
                    {sousTitre}
                </h4>;
                break;
            case 5:
                titre = <h5>{this.props.titre}
                    {sousTitre}
                </h5>;
                break;
            case 6:
                titre = <h6>{this.props.titre}
                    {sousTitre}
                </h6>;
                break;
            default :
                break;
        }

        // CRÉATION DES BOUTONS
        btnList = _.map(this.props.btnList, function (btn, index) {
            return (
                <Button key={"btnbandeau-" + index} {...btn.attrs} {...btn.evts} bsStyle={btn.style} >
                    <Glyphicon glyph={btn.icon}/>{btn.libelle}
                </Button>);
        });

        // CRÉATION DU BOUTON BACK
        if (typeof(this.props.onRetour) != 'undefined') {
            btnRetour = <Button onClick={this.props.onRetour} bsSize="small" className="retour-bandeau" >
                <Glyphicon glyph="arrow-left"/>
            </Button>;
        }

        // AFFICHAGE DU BANDEAU
        return (
            <Row>
                <Col xs={12} md={12} className="bandeau">
                    <Row>
                        <Col xs={12} md={8}>
                            <Row className="titre-bandeau">
                                <Col xs={1} md={1} className="titre-bandeau-icon">{btnRetour}</Col>
                                <Col xs={11} md={11} >{titre}</Col>
                            </Row>
                            <Row className="boutons-bandeau">
                                <Col xs={11} md={11} mdOffset={1}>
                                    <ButtonToolbar>
                                        <ButtonGroup bsSize="small">
                                        {btnList}
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} md={4}>
                            <Row className="bandeau-toolbar-right">
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
});

module.exports = ReactBandeau;
