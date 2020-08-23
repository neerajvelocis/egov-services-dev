import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { BookingMedia } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none !important",
    },
});

class BookingMediaContainer extends Component {
    render() {
        const { ...rest } = this.props;
        return <BookingMedia {...rest} />;
    }
}

const mapStateToProps = (state) => {
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData",
        []
    );
    return { availabilityCheckData };
};

// const connectedBookingMediaContainer = withStyles(styles)(
//     connect(mapStateToProps, null)(BookingMediaContainer)
// );

// export default forwardRef((props, ref) => {
//     <connectedBookingMediaContainer {...props} innerRef={ref} />;
// });
export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(BookingMediaContainer)
);
