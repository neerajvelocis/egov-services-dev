import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const remarksSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "NOC_REMARK",
                    labelKey: "MY_BK_REMARKS_DETAILS_HEADER",
                }),
            }
        },
    },
    body: getCommonContainer({
        Date: getLabelWithValue({
            jsonPath: "Booking.bookingsRemarks[0]",
            callBack: (value) => {
                if (value === undefined) {
                    return "No Remarks Available.";
                } else {
                    let remark = value["bkRemarks"]
                    return remark;
                }
            },
        }),
    }),
});