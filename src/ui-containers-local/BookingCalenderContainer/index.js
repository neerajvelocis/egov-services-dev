import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { BookingCalendar } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});

class BookingCalenderContainer extends Component {
  render() {
    const { ...rest } = this.props;
    console.log(this.props, "my props container");
    return <BookingCalendar {...rest} />;
  }
}

const mapStateToProps = state => {
  let availabilityCheckData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData",
    []
  );
  return { availabilityCheckData};
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(BookingCalenderContainer)
);
