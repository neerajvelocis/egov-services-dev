import React from "react";
import Helmet from "react-helmet";
import DayPicker, { DateUtils } from "react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    getFileUrlFromAPI,
    getQueryArg,
    addQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import "react-day-picker/lib/style.css";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
class ConnectedPlotArea extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            console.log(this.props)
                // let venuesArray = [
                //     {
                //         X: 563.5,
                //         Y: 227,
                //         Radius: 40,
                //     },
                //     {
                //         X: 280.5,
                //         Y: 643,
                //         Radius: 40,
                //     },
                //     {
                //         X: 311.616668701172,
                //         Y: 404,
                //         Radius: 40,
                //     },
                //     {
                //         X: 146.616668701172,
                //         Y: 501,
                //         Radius: 40,
                //     },
                // ];
            let venuesArray = [{
                    X: 417.35,
                    Y: 209,
                    Radius: 20
                },
                {
                    X: 500.35,
                    Y: 253,
                    Radius: 20
                },
                {
                    X: 242.35,
                    Y: 394,
                    Radius: 20
                },
                {
                    X: 519.35,
                    Y: 318,
                    Radius: 20
                },
                {
                    X: 213.35,
                    Y: 431,
                    Radius: 20
                },
                {
                    X: 864.35,
                    Y: 416,
                    Radius: 20
                },
                {
                    X: 892.35,
                    Y: 519,
                    Radius: 20
                },
                {
                    X: 755.35,
                    Y: 632,
                    Radius: 20
                },
                {
                    X: 660.35,
                    Y: 663,
                    Radius: 20
                },
                {
                    X: 261.35,
                    Y: 772,
                    Radius: 20
                },
                {
                    X: 564.35,
                    Y: 770,
                    Radius: 20
                },
                {
                    X: 737.35,
                    Y: 719,
                    Radius: 20
                },
                {
                    X: 851.35,
                    Y: 777,
                    Radius: 20
                },
                {
                    X: 736.35,
                    Y: 916,
                    Radius: 20
                },
                {
                    X: 736.35,
                    Y: 916,
                    Radius: 20
                },
                {
                    X: 547.35,
                    Y: 1050,
                    Radius: 20
                },
                {
                    X: 206.5,
                    Y: 434,
                    Radius: 20
                },
                {
                    X: 768.5,
                    Y: 656,
                    Radius: 20
                },
                {
                    X: 544.5,
                    Y: 1039,
                    Radius: 20
                },
                {
                    X: 544.5,
                    Y: 1096,
                    Radius: 20
                },
            ];
            return venuesArray.map((item) => {
                let coords = `${item.X},${item.Y},${item.Radius}`;

                return ( <area alt = ""
                    title = "custom-text"
                    onClick = {
                        (event) => {

                            window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: 'smooth'
                            })
                        }
                    }
                    shape = "circle"
                    coords = { coords }
                    style = {
                        { cursor: "pointer" }
                    }
                    target = "_self" />
                );
            });
        }
    }
    // const mapStateToProps = (state) => {
    //     return {
    //         availabilityCheckData:
    //             state.screenConfiguration.preparedFinalObject.availabilityCheckData,
    //     };
    // };

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
    };
};

// const connectedPlotArea = withStyles(styles)(
//     connect(mapStateToProps, null)(PlotArea)
// );

// export default forwardRef((props, ref) => {
//     <connectedPlotArea {...props} innerRef={ref} />;
// });


const PlotArea = connect(null, null, null, { forwardRef: true })(ConnectedPlotArea);

export default PlotArea;

// export default connect(null, mapDispatchToProps)(PlotArea);
