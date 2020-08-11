import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getSelectField,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
    setapplicationNumber,
    getUserInfo,
    localStorageSet,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getAvailabilityData, getBetweenDays } from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";

const callBackForReset = (state, dispatch, action) => {
    const bkSector = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheck.bkSector"
    );
    if (bkSector) {
        dispatch(
            handleField(
                "checkavailability",
                "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                "props.value",
                ""
            )
        );
    }

    const actionDefination = [
        {
            path:
                "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
            property: "reservedDays",
            value: [],
        },
    ];
    dispatchMultipleFieldChangeAction(
        "checkavailability",
        actionDefination,
        dispatch
    );
    // dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
};

const callBackForBook = async (state, dispatch) => {
    let availabilityCheck =
        state.screenConfiguration.preparedFinalObject.availabilityCheck;
    console.log(availabilityCheck, "availabilityCheck");
    if (availabilityCheck !== undefined) {
        if (
            (availabilityCheck &&
                availabilityCheck.bkApplicationNumber == null) ||
            availabilityCheck.bkApplicationNumber == undefined
        ) {
            console.log(
                availabilityCheck.bkToDate,
                "availabilityCheck.bkToDate !=="
            );
            if (availabilityCheck.bkToDate === undefined) {
                let warrningMsg = {
                    labelName: "Please select Date RANGE",
                    labelKey: "",
                };
                dispatch(toggleSnackbar(true, warrningMsg, "warning"));
            } else {
                let venueData =
                    state.screenConfiguration.preparedFinalObject
                        .availabilityCheck.bkSector;
                let fromDateString =
                    state.screenConfiguration.preparedFinalObject
                        .availabilityCheck.bkFromDate;
                let toDateString =
                    state.screenConfiguration.preparedFinalObject
                        .availabilityCheck.bkToDate;
                localStorageSet("fromDateCG", fromDateString);
                localStorageSet("toDateCG", toDateString);
                localStorageSet("venueCG", venueData);
                let reviewUrl = `/egov-services/applycommercialground`;
                dispatch(setRoute(reviewUrl));
            }
        } else {
            let venueData =
                state.screenConfiguration.preparedFinalObject.availabilityCheck
                    .bkSector;
            let fromDateString =
                state.screenConfiguration.preparedFinalObject.availabilityCheck
                    .bkFromDate;
            let toDateString =
                state.screenConfiguration.preparedFinalObject.availabilityCheck
                    .bkToDate;
            localStorageSet("fromDateCG", fromDateString);
            localStorageSet("toDateCG", toDateString);
            localStorageSet("venueCG", venueData);
            let reviewUrl = `/egov-services/applycommercialground?applicationNumber=${availabilityCheck.bkApplicationNumber}&tenantId=${availabilityCheck.tenantId}&businessService=${availabilityCheck.businessService}`;
            dispatch(setRoute(reviewUrl));
        }
    } else {
        let warrningMsg = {
            labelName: "Please select Date RANGE",
            labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    }
};

const callBackForSearch = async (state, dispatch) => {
    let sectorData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheck.bkSector"
    );

    console.log(sectorData);

    if (sectorData === "" || sectorData === undefined) {
        dispatch(
            toggleSnackbar(
                true,
                { labelName: "Please Select Booking Venue!", labelKey: "" },
                "warning"
            )
        );
    } else {
        let response = await getAvailabilityData(sectorData);
        if (response !== undefined) {
            let data = response.data;
            // dispatch(prepareFinalObject("bookingCalendar.allowClick", "true"));

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
            prepareFinalObject("reservedAvailabilityData", reservedDates);
            const actionDefination = [
                {
                    path:
                        "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
                    property: "reservedDays",
                    value: reservedDates,
                },
            ];
            dispatchMultipleFieldChangeAction(
                "checkavailability",
                actionDefination,
                dispatch
            );
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please Try After Sometime!", labelKey: "" },
                    "warning"
                )
            );
        }
    }
};

export const checkAvailabilityCalendar = getCommonCard({
    Calendar: getCommonContainer({
        bookingCalendar: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-services",
            componentPath: "BookingCalendar",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 12,
            },
            props: {
                open: false,
                maxWidth: false,
                screenKey: "bookingCalendar",
                reservedDays: [],
            },
            children: {
                popup: {},
            },
        },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 9,
            },
            visible: true,
            props: {
                disabled: true,
            },
        },

        bookButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginTop: "50px",
                },
            },

            children: {
                submitButtonLabel: getLabel({
                    labelName: "Book",
                    labelKey: "BK_CGB_BOOK_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForBook,
            },
            visible: true,
        },
    }),
});
export const checkAvailabilitySearch = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Check Commercial Ground Availability",
        labelKey: "BK_CGB_CHECK_AVAILABILITY_HEADING",
    }),

    break: getBreak(),
    availabilitySearchContainer: getCommonContainer({
        bkSector: {
            ...getSelectField({
                label: {
                    labelName: "Booking Venue",
                    labelKey: "BK_CGB_BOOKING_VENUE_LABEL",
                },

                placeholder: {
                    labelName: "Select Booking Venue",
                    labelKey: "BK_CGB_BOOKING_VENUE_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "applyScreenMdmsData.sector",
                jsonPath: "availabilityCheck.bkSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                // previousButtonIcon: {
                //     uiFramework: "custom-atoms",
                //     componentPath: "Icon",
                //     props: {
                //         iconName: "keyboard_arrow_left"
                //     }
                // },
                submitButtonLabel: getLabel({
                    labelName: "Search",
                    labelKey: "BK_CGB_SEARCH_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch,
            },
            visible: true,
        },
        resetButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    //marginLeft: "100px"
                },
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_CGB_RESET_LABEL",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset,
            },
            visible: true,
        },
    }),
});
