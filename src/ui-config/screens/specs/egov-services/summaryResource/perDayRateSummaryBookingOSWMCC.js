import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const perDayRateSummary = getCommonGrayCard({
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
                    labelName: "Venue Details",
                    labelKey: "BK_OSWMCC_BOOKING_VENUE_DETAILS",
                }),
            },
            // editSection: {
            //   componentPath: "Button",
            //   props: {
            //     color: "primary",
            //     style: {
            //       marginTop: "-10px",
            //       marginRight: "-18px",
            //     },
            //   },
            //   gridDefination: {
            //     xs: 4,
            //     align: "right",
            //   },
            //   children: {
            //     editIcon: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "edit",
            //       },
            //     },
            //     buttonLabel: getLabel({
            //       labelName: "Edit",
            //       labelKey: "NOC_SUMMARY_EDIT",
            //     }),
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       gotoApplyWithStep(state, dispatch, 0);
            //     },
            //   },
            // },
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                perDayRateContainer: getCommonContainer({
                    baseRate: getLabelWithValue(
                        {
                            labelName: "Base Charges",
                            labelKey: "BK_OSWMCC_BOOKING_PER_DAY_RATE_LABEL",
                        },
                        {
                            jsonPath: "perDayRate.ratePerSqrFeetPerDay",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return `Rs ${value} / Sq.ft`
                                }
                            },
                        }
                    ),
                    totalArea: getLabelWithValue(
                        {
                            labelName: "Total Area",
                            labelKey: "BK_OSWMCC_BOOKING_TOTAL_AREA_LABEL",
                        },
                        {
                            jsonPath: "perDayRate.displayArea",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return `${value} Sq.ft`
                                }
                            },
                        }
                    ),
                    areaSlab: getLabelWithValue(
                        {
                            labelName: "Slab",
                            labelKey: "BK_OSWMCC_BOOKING_PER_DAY_RATE_SLAB_LABEL",
                        },
                        {
                            jsonPath: "perDayRate.slab",
                        }
                    ),
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "perDayRate",
        },
        type: "array",
    },
});


