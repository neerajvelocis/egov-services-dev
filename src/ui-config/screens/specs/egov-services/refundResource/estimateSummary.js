import {
    getCommonGrayCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const estimateSummary = getCommonGrayCard({
    estimateCard: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "EstimateCardContainer",
        props: {
            estimate: {
                header: {
                    labelName: "Refund Amount",
                    labelKey: "BK_MY_BK_REFUND_AMOUNT",
                },
                fees: [{ name: "ASD", value: 123 }],
                extra: [
                    { textLeft: "Last Date for Rebate (20% of TL)" },
                    {
                        textLeft: "Penalty (10% of TL) applicable from",
                    },
                    {
                        textLeft:
                            "Additional Penalty (20% of TL) applicable from",
                    },
                ],
            },
        },
    },
});
