var React = require('react/addons');
var Row = ReactB.Row;
var Col = ReactB.Col;
var Glyphicon = ReactB.Glyphicon;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
/************************************************************************
 * Created by yann on 05/02/2015.
 *
 * @param align : Alignement de la sidebar:  "Right ou
 ***********************************************************************/
var Collapse = React.createClass({

    propTypes: {
        align: React.PropTypes.string.isRequired,
        sideWidth: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return this._generateState(true);
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    toggleSidebar: function () {
        var state = this._generateState(false);
        this.setState(state);
    },

    _generateState: function (initial) {
        var state = {};
        // PAS PLIÉ donc on plie
        if (initial || !this.state.isCollapsed) {
            // Alignement GAUCHE
            if (this.props.align == "left") {
                state = {
                    isCollapsed: true,
                    sideWidth: {
                        md: 0,
                        style: {
                            marginLeft: "0px",
                            width: "0px",
                            position: "relative",
                            zIndex: '10'
                        }
                    },
                    bodyWidth: {
                        md: 12,
                        style: {
                        }
                    }
                };
            }
            // Alignement DROITE
            else {
                state = {
                    isCollapsed: true,
                    sideWidth: {
                        md: 0,
                        style: {
                            marginRight: "0px",
                            width: "0px",
                            position: "relative",
                            zIndex: '10'
                        }
                    },
                    bodyWidth: {
                        md: 12,
                        style: {
                            paddingRight: "35px"
                        }
                    }
                };
            }
        }
        // PLIÉ donc on déplie
        else {
            // Alignement GAUCHE
            if (this.props.align == "left") {
                // CALIBRATION DE LA LARGEUR
                var sideWidth = {md: this.props.sideWidth};
                var bodyWidth = {md: 12 - this.props.sideWidth};
                if (sideWidth > 12) {
                    sideWidth = {md: 12};
                    bodyWidth = {md: 0};
                } else if (sideWidth < 0) {
                    sideWidth = {
                        md: 0,
                        style: {
                            width: "0px"
                        }
                    };
                    bodyWidth = {md: 12};
                }
                state = {
                    isCollapsed: false,
                    sideWidth: sideWidth,
                    bodyWidth: bodyWidth
                };
            }
            // Alignement DROITE
            else {
                // CALIBRATION DE LA LARGEUR
                var sideWidth = {md: this.props.sideWidth};
                var bodyWidth = {md: 12 - this.props.sideWidth};
                if (sideWidth > 12) {
                    sideWidth = {md: 12};
                    bodyWidth = {md: 0};
                } else if (sideWidth < 0) {
                    sideWidth = {
                        md: 0,
                        style: {
                            width: "0px"
                        }
                    };
                    bodyWidth = {md: 12};
                }

                state = {
                    isCollapsed: false,
                    sideWidth: sideWidth,
                    bodyWidth: bodyWidth
                };

            }
        }
        return state;
    },

    render: function () {

        // PRÉPARATION DU RETOUR
        var retour = {};

        // OK JEAN PIERRE !
        if (React.Children.count(this.props.children) == 2) {

            // PRÉPARATION DES ATTRIBUTS ----------------------
            if (this.state.isCollapsed == true) {
                var collapseClass = "collapse-collapsed";
                var sideClass = {className: "full-height collapse-sidebar collapse-sidebar-" + this.props.align + " pull-" + this.props.align};
            } else {
                var collapseClass = "collapse-expanded";
                var sideClass = {className: "full-height collapse-sidebar collapse-sidebar-" + this.props.align + " pull-" + this.props.align};
            }

            collapseClass += " md-"+this.props.sideWidth;

            // CLONAGE DES DEUX ÉLÉMENTS POUR AJOUTER DES PROPS
            var propsSide = {
                onToggleClick: this.toggleSidebar,
                isCollapsed: this.state.isCollapsed,
                isLeft: (this.props.align == "left")
            };
            var sideBar = React.addons.cloneWithProps(this.props.children[1], propsSide);

            var content = {};
            if (this.props.align == "left") {
                content = (<Row className={"collapse-row full-height collapse-left "+collapseClass}>
                    <Col  {...this.state.sideWidth} {...sideClass}>
                        {sideBar}
                    </Col>
                    <Col {...this.state.bodyWidth} className="collapse-body full-height">
                        {this.props.children[0]}
                    </Col>
                </Row>);
            } else {
                content = (<Row className={"collapse-row full-height collapse-right "+collapseClass}>
                    <Col {...this.state.bodyWidth} className="collapse-body full-height">
                        {this.props.children[0]}
                    </Col>
                    <Col {...this.state.sideWidth} {...sideClass}>
                        {sideBar}
                    </Col>
                </Row>);
            }

            retour = (content);
        }
        // KO JEAN PIERRE !
        else {
            console.error('Merci de ne passer que deux children à ce composant. (Collapse)');
            retour = <div></div>;
        }
        return (retour);
    }
});

module.exports.Collapse = Collapse;

/***********************************************************************
 * Created by yann on 05/02/2015.
 *
 * @param name : nom a afficher dans le composant
 ***********************************************************************/
var CollapseBody = React.createClass({

    propTypes: {},

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

        return (
            <div className="full-height">{this.props.children}</div>
        );
    }
});

module.exports.CollapseBody = CollapseBody;

/************************************************************************
 * Created by yann on 05/02/2015.
 *
 * @param onToggleClick : Callback appellé sur le click sur la barre verticale
 ***********************************************************************/
var CollapseSidebar = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired,
        onToggleClick: React.PropTypes.func,
        isCollapsed: React.PropTypes.bool,
        isLeft: React.PropTypes.bool,
        icon: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            isCollapsed: true,
            isLeft: false,
            icon: "chevron-up"
        };
    },

    getInitialState: function () {
        return {};
    },

    /**
     *
     */
    componentDidMount: function () {
        //var cw = $(this.getDOMNode()).find('.vertical-text').width();
        //$(this.getDOMNode()).find('.vertical-text').css({'height':cw+'px'});
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {

        var toggleContent = {};
        if (this.props.isLeft) {
            toggleContent = <span className="btn btn-default btn-xs">
                <Glyphicon glyph={this.props.icon}/>{this.props.title}
            </span>;
        } else {
            toggleContent = <span className="btn btn-default btn-xs">
                {this.props.title}
                <Glyphicon glyph={this.props.icon}/>
            </span>;
        }

        // PRÉPARATION DU BOUTON TOGGLE
        var toggle = (
            <div className="vertical-text" onClick={this.props.onToggleClick}>
                {toggleContent}
            </div>);
        // PRÉPARATION DU CONTENU
        var content = !this.props.isCollapsed ? <div className="sidebar-content full-height" key='kctd'>{this.props.children}</div> : {};

        return (<div className="full-height">
            {[toggle, content]}

        </div>);
        /*
         <ReactCSSTransitionGroup transitionName="collapse-body">
         {[toggle, content]}
         </ReactCSSTransitionGroup>
         */
    }
});

module.exports.CollapseSidebar = CollapseSidebar;
