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
    getAvailabilityDataPCC,
    getBetweenDays,
} from "../../ui-config/screens/specs/utils";
import get from "lodash/get";

class PlotArea extends React.Component {
    constructor(props) {
        super(props);
    }

    getAvailabilityData = async (e, venueId) => {
        const { masterDataPCC, availabilityCheckData } = this.props;
        if (venueId !== undefined) {
            this.props.prepareFinalObject(
                "availabilityCheckData.bkBookingVenue",
                venueId
            );
            this.props.prepareFinalObject(
                "Booking.bkBookingVenue",
                venueId
            );

            let requestBody = {
                bookingType: availabilityCheckData.bkBookingType,
                bookingVenue: venueId,
                sector: availabilityCheckData.bkSector,
            };

            const response = await getAvailabilityDataPCC(requestBody);
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                let data = response.data;
                let reservedDates = [];
                var daylist = [];
                data.map((dataitem) => {
                    let start = dataitem.fromDate;
                    let end = dataitem.toDate;
                    daylist = getBetweenDays(start, end);
                    daylist.map((v) => {
                        reservedDates.push(v.toISOString().slice(0, 10));
                    });
                });
                this.props.prepareFinalObject(
                    "availabilityCheckData.reservedDays",
                    reservedDates
                );

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
            } else {
                let errorMessage = {
                    labelName: "Something went wrong, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                this.props.toggleSnackbar(true, errorMessage, "error");
            }
        }
    };

    render() {
        const { masterDataPCC, availabilityCheckData } = this.props;
        return masterDataPCC.map((item) => {
            let coords = `${item.x},${item.y},${item.radius}`;
            let venueId = item.id;
            return (
                <area
                    key={item.id}
                    alt={item.name}
                    title={item.name}
                    onClick={(e) => this.getAvailabilityData(e, item.id)}
                    // onClick={(item.id) => {
                    //     window.scrollTo({
                    //         top: document.body.scrollHeight,
                    //         behavior: "smooth",
                    //     });
                    // }}
                    shape="circle"
                    coords={coords}
                    style={{
                        cursor: "pointer",
                    }}
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
        toggleSnackbar: (jsonPath, value) =>
            dispatch(toggleSnackbar(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
    };
};

export default connect(null, mapDispatchToProps)(PlotArea);
