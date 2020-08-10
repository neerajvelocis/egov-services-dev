
import {
    getBreak, getCommonCard, getCommonContainer, getCommonGrayCard, getCommonTitle,
    getSelectField, getDateField, getTextField, getPattern, getLabel, getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
    setapplicationNumber,
    getUserInfo,
    localStorageSet
} from "egov-ui-kit/utils/localStorageUtils";
import {
    prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions"; import {
    dispatchMultipleFieldChangeAction,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";

export const getDates = async (sectorData) => {


    let requestBody = {
        bookingType: 'GROUND_FOR_COMMERCIAL_PURPOSE',
        bookingVenue: sectorData

    }

    try {
        const payload = await httpRequest(
            "post",
            "bookings/commercial/ground/availability/_search",
            "",
            [],
            requestBody
        )
        // dispatch(prepareFinalObject("occupiedDates", payload.data));
        return payload

    } catch (exception) {

    }
};


export const callBackForReset = (state, dispatch, action) => {
    const preparedFinalObject = get(
        state,
        "screenConfiguration.preparedFinalObject"
    );
    const { bookingCalendar } = preparedFinalObject;
    console.log(bookingCalendar, "bookingCalendar");
    if (bookingCalendar.sector) {

        dispatch(
            handleField(
                "checkavailability",
                "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.Sector",
                "props.value",
                ""
            )
        );

    }

    if (bookingCalendar.toDateToDisplay) {
        dispatch(
            handleField(
                "checkavailability",
                "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDatePeriodOfDisplay",
                "props.value",
                ""
            )
        );
    }
    if (bookingCalendar.fromDateToDisplay) {
        dispatch(
            handleField(
                "checkavailability",
                "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDatePeriodOfDisplay",
                "props.value",
                ""
            )
        );
    }

    const actionDefination = [

        {
            path: "components.headerDiv.children.NOCCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
            property: "reservedDays",
            value: []
        },

    ];
    dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch);
    dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));

};


const callBackForBook = async (state, dispatch) => {

    const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    if ('Check' in state.screenConfiguration.preparedFinalObject && state.screenConfiguration.preparedFinalObject.Check.toDate !== "") {

        let venueData = state.screenConfiguration.preparedFinalObject.bookingCalendar.sector;
        let fromDateString = state.screenConfiguration.preparedFinalObject.Check.fromDate;
        let toDateString = state.screenConfiguration.preparedFinalObject.Check.toDate;
        localStorageSet("fromDateCG", fromDateString)
        localStorageSet("toDateCG", toDateString)
        localStorageSet("venueCG", venueData)
        let reviewUrl = `${appendUrl}/egov-services/applycommercialground`;
        dispatch(setRoute(reviewUrl))
    } else {
        let warrningMsg = { labelName: "Please select Date RANGE", labelKey: "" };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    }
}


var getDaysArray = function (start, end) {
    let arr = [];
    let endDate = new Date(end);
    for (let dt = new Date(start); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    console.log(arr, "ARRAY")
    return arr;
};



export const callBackForSearch = async (state, dispatch) => {

    let sectorData = get(
        state,
        "screenConfiguration.preparedFinalObject.bookingCalendar.sector"
    );

    // let toDateData = get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.bookingCalendar.toDateToDisplay"
    // );
    // let fromDateData = get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.bookingCalendar.fromDateToDisplay"
    // );

    if (sectorData === "") {
        dispatch(toggleSnackbar(true, { labelName: "Please Select Booking Venue!", labelKey: "" },
            "warning"));
    }
    else {


        // let promise = new Promise((resolve, reject) => {
        //     setTimeout(() => resolve(['2020-07-01', '2020-07-04', '2020-07-15', '2020-07-31',]), 1000)
        // })

        // let result = await promise; // wait until the promise resolves (*)

        // let promise = new Promise((resolve, reject) => {
        //          setTimeout(() => resolve(['2020-07-01', '2020-07-04', '2020-07-15', '2020-07-31',]), 1000)
        //      })


        let response = await getDates(sectorData)

        console.log(response, "res1")
        if (await response !== undefined) {
            let data = response.data
            console.log(data, "datedata")

            dispatch(prepareFinalObject("bookingCalendar.allowClick", "true"));

            let reservedDates = []
            var daylist = []
            data.map((dataitem) => {
                let start = dataitem.fromDate;
                let end = dataitem.toDate;
                daylist = getDaysArray(start, end);
                console.log(daylist, "LOOP1")


                daylist.map((v) => {
                    reservedDates.push(v.toISOString().slice(0, 10))
                    console.log(reservedDates, "LOOP2")
                })

            })
            console.log(reservedDates, "daylist")
            const actionDefination = [

                {
                    path: "components.headerDiv.children.NOCCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
                    property: "reservedDays",
                    value: reservedDates
                },

            ];
            dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch);
        }
        else {
            dispatch(toggleSnackbar(true, { labelName: "Please Try After Sometime!", labelKey: "" },
                "warning"));
        }

    }





}







export const NOCCalendar = getCommonCard({
    Calendar: getCommonContainer({
        // dummyDiv: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Div",
        //     gridDefination: {
        //         xs: 12,

        //         md: 1,
        //     },
        //     visible: true,
        //     props: {
        //         disabled: true
        //     }
        // },
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
                disabled: true
            }
        },


        bookButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginTop: "50px"

                }

            },

            children: {
                submitButtonLabel: getLabel({
                    labelName: "Book",
                    labelKey: "BK_CGB_BOOK_LABEL"
                }),

            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForBook
            },
            visible: true,
        },


    })

})
export const NOCApplication = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Check Commercial Ground Availability",
        labelKey: "BK_CGB_CHECK_AVAILABILITY_HEADING"
    }),

    break: getBreak(),
    appStatusAndToFromDateContainer: getCommonContainer({
        Sector: {
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

                sourceJsonPath: "calendarScreenMdmsData.sector",
                jsonPath: "bookingCalendar.sector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        // fromDatePeriodOfDisplay: getDateField({
        //     label: {
        //         labelName: "From Date",
        //         labelKey: "BK_CGB_FROM_DATE_LABEL"
        //     },
        //     placeholder: {
        //         labelName: "Enter From Date",
        //         labelKey: "BK_CGB_FROM_DATE_PLACEHOLDER"
        //     },
        //     jsonPath: "bookingCalendar.fromDateToDisplay",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 6,
        //         md: 4,
        //     },
        //     pattern: getPattern("Date"),
        //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //     required: true,
        //     afterFieldChange: (action, state, dispatch) => {
        //         let today = getTodaysDateInYMD();
        //         let FromDate = get(state.screenConfiguration.preparedFinalObject, `bookingCalendar.fromDateToDisplay`, []);
        //         if (FromDate < today) {
        //             dispatch(toggleSnackbar(true, { labelName: "Display Date should be greater than today!", labelKey: "" },
        //                 "warning"));
        //             set(state, 'screenConfiguration.preparedFinalObject.bookingCalendar.fromDateToDisplay', '');
        //             dispatch(prepareFinalObject("bookingCalendar.fromDateToDisplay", ''));
        //         }
        //     }
        // }),
        // toDatePeriodOfDisplay: getDateField({
        //     label: {
        //         labelName: "To Date",
        //         labelKey: "BK_CGB_TO_DATE_LABEL"
        //     },
        //     placeholder: {
        //         labelName: "Enter To Date",
        //         labelKey: "BK_CGB_TO_DATE_PLACEHOLDER"
        //     },
        //     jsonPath: "bookingCalendar.toDateToDisplay",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 6,
        //         md: 4,
        //     },
        //     pattern: getPattern("Date"),
        //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //     required: true,
        //     afterFieldChange: (action, state, dispatch) => {
        //         let FromDate = get(state.screenConfiguration.preparedFinalObject, `bookingCalendar.fromDateToDisplay`, []);
        //         let ToDate = get(state.screenConfiguration.preparedFinalObject, `bookingCalendar.toDateToDisplay`, []);
        //         if (ToDate <= FromDate) {
        //             dispatch(toggleSnackbar(true, { labelName: "To Date should be greater than or equal to From Date!", labelKey: "" },
        //                 "warning"));
        //             set(state, 'screenConfiguration.preparedFinalObject.bookingCalendar.toDateToDisplay', '');
        //             dispatch(prepareFinalObject("bookingCalendar.toDateToDisplay", ''));
        //         }
        //     }
        // }),
        // dummyDiv: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Div",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 12,
        //         md: 12,



        //     },
        //     visible: true,
        //     props: {
        //         disabled: true
        //     }
        // },

        //     },
        //     visible: true,
        //     props: {
        //         disabled: true
        //     }
        // },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px"
                }
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
                    labelKey: "BK_CGB_SEARCH_LABEL"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch
            },
            visible: true
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
                }
            },
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 3,

            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_CGB_RESET_LABEL"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset

            },
            visible: true
        },
       

    }),

});
