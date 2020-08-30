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
import PlotArea from "./plotArea";
//import Image from "./Sector 39_CG1731_Photo.jpg"
import Image from "./park11.jpeg"
class BookingMedia extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return ( <div>
                <img
                    id="Image-Maps-Com-image-maps-2017-04-25-084654"
                    src={Image}
                    border="0"
                    usemap="#image-maps-2017-04-25-084654"
                    alt=""
                />
                <map
                    name="image-maps-2017-04-25-084654"
                    id="ImageMapsCom-image-maps-2017-04-25-084654"
                >
                    <PlotArea innerCellRef={this.props} />
                </map>
            </div>
        )

    }
}
const mapStateToProps = (state) => {
    return {
        availabilityCheckData: state.screenConfiguration.preparedFinalObject.availabilityCheckData,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         prepareFinalObject: (jsonPath, value) =>
//             dispatch(prepareFinalObject(jsonPath, value)),
//         changeRoute: (path) => dispatch(setRoute(path)),
//     };
// };



export default connect(mapStateToProps, null, null, { forwardRef: true })(BookingMedia);
