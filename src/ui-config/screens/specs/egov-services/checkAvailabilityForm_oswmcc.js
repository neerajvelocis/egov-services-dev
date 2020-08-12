
import {
    getBreak, getCommonCard, getCommonContainer, getCommonGrayCard, getCommonTitle,
    getSelectField, getDateField, getTextField, getPattern, getLabel, getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions"; import {
    dispatchMultipleFieldChangeAction,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";

const getDates = async (state, dispatch) => {

    let bookingVenueName = get(
        state,
        "screenConfiguration.preparedFinalObject.bookingCalendar.sector"
    );

    let requestBody = {
        bookingType: 'OPEN_SPACE_WITHIN_MCC',
        bookingVenue: bookingVenueName,

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
    // if ('Check' in state.screenConfiguration.preparedFinalObject && state.screenConfiguration.preparedFinalObject.Check.toDate !== "") {

    // let venueData = state.screenConfiguration.preparedFinalObject.bookingCalendar.sector;
    // let fromDateString = state.screenConfiguration.preparedFinalObject.Check.fromDate;
    // let toDateString = state.screenConfiguration.preparedFinalObject.Check.toDate;
    //let reviewUrl = `${appendUrl}/egov-services/applyopenspacewmcc?from=${fromDateString}&to=${toDateString}&venue=${venueData}`;
    let reviewUrl = `${appendUrl}/egov-services/applyopenspacewmcc`;
    dispatch(setRoute(reviewUrl))
    // } else {
    //     let warrningMsg = { labelName: "Please select Date RANGE", labelKey: "" };
    //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    // }
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


const callBackForAddNewLocation = async (state, dispatch) => {

    const addLocationURL = `/egov-services/applyNewLocationUnderMCC`;
    dispatch(setRoute(addLocationURL));
}

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


        let response = await getDates()

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
        bookingCalendar: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-services",
            componentPath: "BookingCalendar",
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
        break: getBreak(),
        bookButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    //minWidth: "200px",
                    height: "48px",

                }

            },
            children: {
                submitButtonLabel: getLabel({
                    labelName: "Book",
                    labelKey: "BK_OSWMCC_BOOK_LABEL"
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
        labelName: "Check Open Space Availability",
        labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_HEADING"
    }),
    addNewLocButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {

                height: "48px",

            }
        },

        children: {
            resetButtonLabel: getLabel({
                labelName: "Add New Location",
                labelKey: "BK_OSWMCC_NEW_LOCATION_LABEL"
            })
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForAddNewLocation

        },
        visible: true
    },
    break: getBreak(),
    appStatusAndToFromDateContainer: getCommonContainer({
        Sector: {
            ...getSelectField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_OSWMCC_BOOKING_LOCALITY__LABEL",
                },

                placeholder: {
                    labelName: "Select Locality",
                    labelKey: "BK_OSWMCC_BOOKING_LOCALITY_PLACEHOLDER",
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
            beforeFieldChange: (action, state, dispatch) => {

                // dispatch(
                //     handleField(
                //         "checkavailability_oswmcc",
                //         "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.SectorLocations",
                //         "props.dropdownData",
                //         [
                //             { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
                //             { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
                //             { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
                //         ]
                //     )
                // );
                const calendarScreenMdmsData = get(
                    state,
                    "screenConfiguration.preparedFinalObject.calendarScreenMdmsData"
                );
                const sectorWiselocationsObject = get(
                    state,
                    "screenConfiguration.preparedFinalObject.sectorWiselocationsObject"
                );
console.log(action, "nero action");
                const locationsWithinSector = get(
                    sectorWiselocationsObject,
                    action.value
                );
                

                // let payload = {};
                // let locationsWithinSector = [
                //         { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
                //         { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
                //         { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
                //     ];
                    calendarScreenMdmsData.locationsWithinSector = locationsWithinSector;
                    dispatch(prepareFinalObject("calendarScreenMdmsData", calendarScreenMdmsData));    
                //set(action, "screenConfiguration.preparedFinalObject.calendarScreenMdmsData.locationsWithinSector", locationsWithinSector)
                // dispatch(
                //     handleField(
                //         "checkavailability_oswmcc",
                //         "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.SectorLocations",
                //         "visible",
                //         true
                //     )
                // );

                // set(action, "components.headerDiv.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.SectorLocations", [
                //     { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
                //     { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
                //     { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
                // ])
            }
        },
        SectorLocations: {
            ...getSelectField({
                label: {
                    labelName: "Booking Locations",
                    labelKey: "BK_OSWMCC_BOOKING_LOCAION_LABEL",
                },

                placeholder: {
                    labelName: "Select Booking Location",
                    labelKey: "BK_OSWMCC_BOOKING_LOCAION_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "calendarScreenMdmsData.locationsWithinSector",
                jsonPath: "bookingCalendar.locationsWithinSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        dummyDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
                xs: 0,
                sm: 6,
                md: 0,

            },
            visible: true,
            props: {
                disabled: true
            }
        },

        resetButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    // minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    //marginLeft: "100px"
                }
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_OSWMCC_BOOKING_CHECK_RESET_LABEL"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset

            },
            visible: true
        },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    // minWidth: "200px",
                    height: "48px",
                    marginRight: "16px"
                }
            },

            children: {

                submitButtonLabel: getLabel({
                    labelName: "Check Availability",
                    labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_LABEL"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch
            },
            visible: true
        },

    }),

});
