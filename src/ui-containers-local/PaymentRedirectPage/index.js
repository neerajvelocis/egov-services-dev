import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "../../ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResultsView } from "../../ui-utils/commons";

class PaymentRedirect extends Component {
    componentDidMount = async () => {
        let { search } = this.props.location;
        const txnQuery = search
            .split("&")[0]
            .replace("eg_pg_txnid", "transactionId");
        try {
            let pgUpdateResponse = await httpRequest(
                "post",
                "pg-service/transaction/v1/_update" + txnQuery,
                "_update",
                [],
                {}
            );

            console.log("pgUpdateResponse", pgUpdateResponse);
            let consumerCode = get(
                pgUpdateResponse,
                "Transaction[0].consumerCode"
            );
            let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
            let transactionStatus = get(
                pgUpdateResponse,
                "Transaction[0].txnStatus"
            );
            let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
            let bookingType = get(
                pgUpdateResponse,
                "Transaction[0].productInfo"
            );

            if (transactionStatus === "FAILURE") {
                if (bookingType === "OSBM") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${bookingType}`
                    );
                } else if (bookingType === "GFCP") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${bookingType}`
                    );
                }

                else {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${bookingType}`
                    );
                }
            } else {
                let response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: consumerCode },
                ]);

                let payload = response.bookingsModelList[0];
                set(
                    payload,
                    "bkAction",
                    bookingType === "OSBM" || bookingType === "OSUJM" ? "PAY" : bookingType === "GFCP" ? "APPLY" : "PAIDAPPLY"
                );
                response = await httpRequest(
                    "post",
                    "/bookings/api/_update",
                    "",
                    [],
                    {
                        Booking: payload,
                    }
                );
                if (bookingType === "OSBM") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}&businessService=${bookingType}`
                    );
                } else if (bookingType === "GFCP") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}&businessService=${bookingType}`
                    );
                }


                else {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}&businessService=${bookingType}`
                    );
                }
            }
        } catch (e) {
            //alert(e);
        }
    };
    render() {
        return <div />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(setRoute(route)),
    };
};

export default connect(null, mapDispatchToProps)(withRouter(PaymentRedirect));
