import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonSubHeader,
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
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );
    if (availabilityCheckData.bkSector) {
        dispatch(
            handleField(
                "checkavailability",
                "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                "props.value",
                ""
            )
        );
    }
    if (availabilityCheckData.bkFromDate) {
        dispatch(
            handleField(
                "checkavailability",
                "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                "props.value",
                ""
            )
        );
    }
    if (availabilityCheckData.reservedDays) {
        dispatch(
            handleField(
                "checkavailability",
                "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar",
                "props.reservedDays",
                []
            )
        );
    }

    // const actionDefination = [
    //     {
    //         path:
    //             "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
    //         property: "reservedDays",
    //         value: [],
    //     },
    // ];
    // dispatchMultipleFieldChangeAction(
    //     "checkavailability",
    //     actionDefination,
    //     dispatch
    // );
    // dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
};

const callBackForBook = async (state, dispatch) => {
    let availabilityCheckData =
        state.screenConfiguration.preparedFinalObject.availabilityCheckData;
    console.log(availabilityCheckData, "availabilityCheckData");
    if (availabilityCheckData === undefined) {
        let warrningMsg = {
            labelName: "Please select Date RANGE",
            labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    } else {
        if (
            availabilityCheckData.bkToDate === undefined ||
            availabilityCheckData.bkToDate === ""
        ) {
            let warrningMsg = {
                labelName: "Please select Date RANGE",
                labelKey: "",
            };
            dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        } else if ("bkApplicationNumber" in availabilityCheckData) {
            dispatch(
                setRoute(
                    `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.locationsWithinSector}`
                )
            );
        } else
            dispatch(
                setRoute(
                    `/egov-services/applyopenspacewmcc?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.locationsWithinSector}`
                )
            );
    }
};

const callBackForAddNewLocation = async (state, dispatch) => {
    const addLocationURL = `/egov-services/applyNewLocationUnderMCC`;
    dispatch(setRoute(addLocationURL));
};

const callBackForSearch = async (state, dispatch) => {
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    console.log(availabilityCheckData, "availabilityCheckData in form");

    if (availabilityCheckData === undefined) {
        dispatch(
            toggleSnackbar(
                true,
                { labelName: "Please Select Booking Venue!", labelKey: "" },
                "warning"
            )
        );
    } else {
        if ("bkSector" in availabilityCheckData) {
            let bookingVenue =
                availabilityCheckData && availabilityCheckData.bkSector;
            console.log(bookingVenue, "bookingVenue");
            let response = await getAvailabilityData(bookingVenue);
            if (response !== undefined) {
                let data = response.data;
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
                dispatch(
                    prepareFinalObject(
                        "availabilityCheckData.reservedDays",
                        reservedDates
                    )
                );
                // const actionDefination = [
                //     {
                //         path:
                //             "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
                //         property: "reservedDays",
                //         value: reservedDates,
                //     },
                // ];
                // dispatchMultipleFieldChangeAction(
                //     "checkavailability",
                //     actionDefination,
                //     dispatch
                // );
            } else {
                dispatch(
                    toggleSnackbar(
                        true,
                        {
                            labelName: "Please Try After Sometime!",
                            labelKey: "",
                        },
                        "warning"
                    )
                );
            }
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please Select Booking Venue!", labelKey: "" },
                    "warning"
                )
            );
        }
    }
    // if (availabilityCheckData.bkSector === "" || availabilityCheckData.bkSector === undefined) {
    //     dispatch(
    //         toggleSnackbar(
    //             true,
    //             { labelName: "Please Select Booking Venue!", labelKey: "" },
    //             "warning"
    //         )
    //     );
    // } else {
    //     let response = await getAvailabilityData(availabilityCheckData.bkSector);
    //     if (response !== undefined) {
    //         let data = response.data;
    //         let reservedDates = [];
    //         var daylist = [];
    //         data.map((dataitem) => {
    //             let start = dataitem.fromDate;
    //             let end = dataitem.toDate;
    //             daylist = getBetweenDays(start, end);
    //             daylist.map((v) => {
    //                 reservedDates.push(v.toISOString().slice(0, 10));
    //             });
    //         });
    //         prepareFinalObject("reservedAvailabilityData", reservedDates);
    //         const actionDefination = [
    //             {
    //                 path:
    //                     "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
    //                 property: "reservedDays",
    //                 value: reservedDates,
    //             },
    //         ];
    //         dispatchMultipleFieldChangeAction(
    //             "checkavailability",
    //             actionDefination,
    //             dispatch
    //         );
    //     } else {
    //         dispatch(
    //             toggleSnackbar(
    //                 true,
    //                 { labelName: "Please Try After Sometime!", labelKey: "" },
    //                 "warning"
    //             )
    //         );
    //     }
    // }
};


export const checkAvailabilitySearch = getCommonCard({
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
                    labelName: "Check Open Space Availability",
                    labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_HEADING",
                }),
            },
            addNewLocButton: {
                componentPath: "Button",
                props: {
                    variant: "contained",
                    color: "primary",
                    style: {
                        // marginTop: "-10px",
                        marginRight: "-18px",
                    },
                },
                gridDefination: {
                    xs: 4,
                    align: "right",
                },
                children: {
                    // editIcon: {
                    //     uiFramework: "custom-atoms",
                    //     componentPath: "Icon",
                    //     props: {
                    //         iconName: "edit",
                    //     },
                    // },
                    buttonLabel: getLabel({
                        labelName: "Add New Location",
                        labelKey: "BK_OSWMCC_NEW_LOCATION_LABEL",
                    }),
                },
                onClickDefination: {
                    action: "condition",
                    callBack: callBackForAddNewLocation
                },
                visible: true,
            },
           
        },
    },
    // subHeader: getCommonTitle({
    //     labelName: "Check Open Space Availability",
    //     labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_HEADING"
    // }),
    // addNewLocButton: {
    //     componentPath: "Button",
    //     props: {
    //         variant: "contained",
    //         color: "primary",
    //         style: {

    //             height: "48px",

    //         }
    //     },

    //     children: {
    //         resetButtonLabel: getLabel({
    //             labelName: "Add New Location",
    //             labelKey: "BK_OSWMCC_NEW_LOCATION_LABEL"
    //         })
    //     },
    //     onClickDefination: {
    //         action: "condition",
    //         callBack: callBackForAddNewLocation

    //     },
    //     visible: true
    // },
    break: getBreak(),
    availabilitySearchContainer: getCommonContainer({
        bkSector: {
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

                sourceJsonPath: "applyScreenMdmsData.sector",
                jsonPath: "availabilityCheckData.bkSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: (action, state, dispatch) => {
                const applyScreenMdmsData = get(
                    state,
                    "screenConfiguration.preparedFinalObject.applyScreenMdmsData"
                );
                const sectorWiselocationsObject = get(
                    state,
                    "screenConfiguration.preparedFinalObject.sectorWiselocationsObject"
                );
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
                applyScreenMdmsData.locationsWithinSector = locationsWithinSector;
                dispatch(
                    prepareFinalObject(
                        "applyScreenMdmsData",
                        applyScreenMdmsData
                    )
                );
                //set(action, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.locationsWithinSector", locationsWithinSector)
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
            },
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

                sourceJsonPath: "applyScreenMdmsData.locationsWithinSector",
                jsonPath: "availabilityCheckData.locationsWithinSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
        },
        // dummyDiv: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Div",
        //     gridDefination: {
        //         xs: 0,
        //         sm: 6,
        //         md: 0,

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
                    marginRight: "16px",
                },
            },

            children: {
                submitButtonLabel: getLabel({
                    labelName: "Check Availability",
                    labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_LABEL",
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
                    // marginRight: "16px",
                    marginLeft: "16px",
                },
            },

            children: {
                resetButtonLabel: getLabel({
                    labelName: "Reset",
                    labelKey: "BK_OSWMCC_BOOKING_CHECK_RESET_LABEL",
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
export const checkAvailabilityCalendar = getCommonCard({
    Calendar: getCommonContainer({
        bookingCalendar: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-services",
            componentPath: "BookingCalenderContainer",
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
                    labelKey: "BK_OSWMCC_BOOK_LABEL",
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
