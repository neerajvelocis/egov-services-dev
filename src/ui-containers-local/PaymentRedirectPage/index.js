import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "../../ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResultsView } from "../../ui-utils/commons";
import {
    getAccessToken,
    getTenantId,
    getLocale,
    getUserInfo,
    localStorageGet,
    setapplicationNumber,
    getapplicationNumber,
    getapplicationType,
    lSRemoveItem,
} from "egov-ui-kit/utils/localStorageUtils";

class PaymentRedirect extends Component {
    componentDidMount = async () => {
        let { search } = this.props.location;
        try {
            // let pgUpdateResponse = await httpRequest(
            //     "post",
            //     "pg-service/transaction/v1/_update" + search,
            //     "_update",
            //     [],
            //     {}
            // );

            // let consumerCode = get(
            //     pgUpdateResponse,
            //     "Transaction[0].consumerCode"
            // );
			// let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
			// let transactionStatus = get(pgUpdateResponse, "Transaction[0].txnStatus")
			// let transactionId = get(pgUpdateResponse,"Transaction[0].txnId");


			
			let consumerCode = "CH-BK-2020-07-20-000493";
			let tenantId = "ch";
			let transactionStatus = "SUCCESS";
			let transactionId = "hldsfiwfodflkadpffd";

            if (transactionStatus === "FAILURE") {
                if (getapplicationType() === "PETNOC") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
                    );
                } else if (getapplicationType() === "SELLMEATNOC") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement-sellmeat?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
                    );
                } else if (getapplicationType() === "ROADCUTNOC") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement-roadcut?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
                    );
                } else {
                    this.props.setRoute(
                        `/egov-services/acknowledgement-adv?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
                    );
                }
            } else {
				alert("in success")
                // let data = {
                //     bkBookingType: getapplicationType(),
                //     tenantId: getTenantId(),
                //     bkApplicationStatus: "PAID",
				// 	bkApplicationNumber: consumerCode,
				// 	bkAction : "PAY",
				// 	bkAmount: localStorageGet(`amount`),
				// 	bkCgst: localStorageGet(`gstAmount`),
				// 	performanceBankGuaranteeCharges: localStorageGet(
				// 		`performanceBankGuaranteeCharges`
				// 	),
                //     auditDetails: {
                //         createdBy: 1,
                //         lastModifiedBy: 1,
                //         createdTime: 1578894136873,
                //         lastModifiedTime: 1578894136873,
                //     },
                // };

                let response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: consumerCode },
				]);
				
				let payload = response.bookingsModelList[0];
				set(payload, "businessService", "OSBM");
				set(payload, "bkAction", "PAY");
				set(payload, "bkAmount", "2360");
				set(payload, "bkCgst", "360");
				
				console.log("payload", payload);

                response = await httpRequest(
                    "post",
                    "/bookings/api/_update",
                    "",
                    [],
                    {
						Booking: payload,
					}
                );
                lSRemoveItem(`amount`);
                lSRemoveItem(`gstAmount`);
                lSRemoveItem(`performanceBankGuaranteeCharges`);

                if (getapplicationType() === "OSBM") {
                    this.props.setRoute(
                        `/egov-services/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
                    );
                }  else {
                    this.props.setRoute(
                        `/egov-services/acknowledgement-adv?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
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
