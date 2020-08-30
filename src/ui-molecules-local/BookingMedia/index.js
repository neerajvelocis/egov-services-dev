import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PlotArea from "./plotArea";
//import Image from "./Sector 39_CG1731_Photo.jpg"
import Image from "./park11.jpeg";

class BookingMedia extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { masterDataPCC, availabilityCheckData } = this.props;
        return (
            <div>
                <img
                    id="Image-Maps-Com-image-maps-2017-04-25-084654"
                    src={`https://zfunds3.s3.ap-south-1.amazonaws.com/park11.jpeg`}
                    // src={`https://zfunds3.s3.ap-south-1.amazonaws.com/${masterDataPCC[0].imagePath}`}
                    border="0"
                    usemap="#image-maps-2017-04-25-084654"
                    alt=""
                />
                <map
                    name="image-maps-2017-04-25-084654"
                    id="ImageMapsCom-image-maps-2017-04-25-084654"
                >
                    <PlotArea masterDataPCC={masterDataPCC} availabilityCheckData={availabilityCheckData} />
                </map>
            </div>
        );
    }
}
// const mapStateToProps = (state) => {
//     return {
//         availabilityCheckData: state.screenConfiguration.preparedFinalObject.availabilityCheckData,
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         prepareFinalObject: (jsonPath, value) =>
//             dispatch(prepareFinalObject(jsonPath, value)),
//         changeRoute: (path) => dispatch(setRoute(path)),
//     };
// };

export default connect(null, null)(BookingMedia);
