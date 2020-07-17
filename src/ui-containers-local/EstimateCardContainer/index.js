import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {
    render() {
        return <FeesEstimateCard estimate={this.props.estimate} />;
    }
}

const sortBillDetails = (billDetails = []) => {
    let sortedBillDetails = [];

    sortedBillDetails = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
    return sortedBillDetails;
};

const formatTaxHeaders = (billDetail = {}) => {
    let formattedFees = [];
    const { billAccountDetails = [] } = billDetail;
    formattedFees = billAccountDetails.map((taxHead) => {
        return {
            info: {
                labelKey: taxHead.taxHeadCode,
                labelName: taxHead.taxHeadCode,
            },
            name: {
                labelKey: taxHead.taxHeadCode,
                labelName: taxHead.taxHeadCode,
            },
            value: taxHead.amount,
            order: taxHead.order,
        };
    });
    formattedFees.sort(function (x, y) {
        return x.order - y.order;
    });
    //formattedFees.reverse();
    return formattedFees;
};

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    console.log("ownProps", ownProps);
    
    // const fees = formatTaxHeaders(
    //     sortBillDetails(
    //         get(
    //             screenConfiguration,
    //             "preparedFinalObject.ReceiptTemp[0].Bill",
    //             []
    //         )
    //     )[0]
    // );
    const fees = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp.Bill",
        []
    );

    // const billDetails = get(
    //     screenConfiguration,
    //     "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails",
    //     []
    // );
    let totalAmount = fees.amount;
    let arrears = 0;
    // for (let billDetail of billDetails) {
    //     totalAmount += billDetail.amount;
    // }
    // if (totalAmount > 0) {
    //     arrears = totalAmount - billDetails[0].amount;
    // }
    const estimate = {
        header: { labelName: ownProps.estimate.header.labelName, labelKey: ownProps.estimate.header.labelKey },
        fees: [
            {
                name: {
                    labelKey: "Label Key key",
                    labelName: "Label Key Name",
                },
                value: fees.amount,
            },
        ],
        totalAmount,
        arrears,
    };
    return { estimate };
};

export default connect(mapStateToProps, null)(EstimateCardContainer);
