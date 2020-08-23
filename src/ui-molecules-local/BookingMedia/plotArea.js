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
        let venuesArray = [
            {
                X: 563.5,
                Y: 227,
                Radius: 40,
            },
            {
                X: 280.5,
                Y: 643,
                Radius: 40,
            },
            {
                X: 311.616668701172,
                Y: 404,
                Radius: 40,
            },
            {
                X: 146.616668701172,
                Y: 501,
                Radius: 40,
            },
        ];
        return venuesArray.map((item) => {
            let coords = `${item.X},${item.Y},${item.Radius}`;

            return (
                <area
                    alt=""
                    title="custom-text"
                    onClick={(event) => {
                        alert("clicked")
                    }}
                    shape="circle"
                    coords={coords}
                    style={{ cursor: "pointer" }}
                    target="_self"
                />
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
