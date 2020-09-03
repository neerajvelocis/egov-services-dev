import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonSubHeader,
    getCommonTitle,
    getSelectField,
    getDateField,
    getLabel,
    getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup } from "../utils";
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
import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import {
    getAvailabilityDataOSWMCC,
    getPerDayRateOSWMCC,
    getNewLocatonImages,
    getMasterDataPCC,
    getBetweenDays,
} from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getTodaysDateInYMD, getFinancialYearDates } from "../utils";

export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
    let allAreFilled = true;
    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("[required]")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
            if (!i.value) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
            }
            if (i.getAttribute("aria-invalid") === "true" && allAreFilled) {
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });

    document
        .getElementById("apply_form" + activeStep)
        .querySelectorAll("input[type='hidden']")
        .forEach(function (i) {
            i.parentNode.classList.remove("MuiInput-error-853");
            i.parentNode.parentNode.parentNode.classList.remove(
                "MuiFormLabel-error-844"
            );
            if (i.value == i.placeholder) {
                i.focus();
                allAreFilled = false;
                i.parentNode.classList.add("MuiInput-error-853");
                i.parentNode.parentNode.parentNode.classList.add(
                    "MuiFormLabel-error-844"
                );
                allAreFilled = false;
                isFormValid = false;
                hasFieldToaster = true;
            }
        });
    if (!allAreFilled) {
        //alert('Fill all fields')
        isFormValid = false;
        hasFieldToaster = true;
    } else {
        //alert('Submit')
        isFormValid = true;
        hasFieldToaster = false;
    }
    return [isFormValid, hasFieldToaster];
};

// const callBackForReset = (state, dispatch, action) => {
//     const availabilityCheckData = get(
//         state,
//         "screenConfiguration.preparedFinalObject.availabilityCheckData"
//     );

//     if (availabilityCheckData !== undefined) {
//         if (availabilityCheckData.bkSector) {
//             dispatch(
//                 handleField(
//                     "checkavailability_oswmcc",
//                     "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkSector",
//                     "props.value",
//                     undefined
//                 )
//             );
//         }
//         if (availabilityCheckData.bkBookingVenue) {
//             dispatch(
//                 handleField(
//                     "checkavailability_oswmcc",
//                     "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
//                     "props.value",
//                     undefined
//                 )
//             );
//         }
//         set(
//             state.screenConfiguration.screenConfig["checkavailability_oswmcc"],
//             "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.viewDetailsButton.visible",
//             false
//         );
//         dispatch(prepareFinalObject("availabilityCheckData", undefined));
//     }
//     // if (availabilityCheckData.bkFromDate) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", ""))
//     // }
//     // if (availabilityCheckData.bkToDate) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.bkToDate", ""))
//     // }
//     // if (availabilityCheckData.reservedDays) {
//     //     dispatch(prepareFinalObject("availabilityCheckData.reservedDays", []))
//     // }

//     // const actionDefination = [
//     //     {
//     //         path:
//     //             "components.div.children.availabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
//     //         property: "reservedDays",
//     //         value: [],
//     //     },
//     // ];
//     // dispatchMultipleFieldChangeAction(
//     //     "checkavailability",
//     //     actionDefination,
//     //     dispatch
//     // );
//     // dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
// };

const callBackForBook = async (state, dispatch) => {
    // dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
    let availabilityCheckData =
        state.screenConfiguration.preparedFinalObject.availabilityCheckData;
    if (availabilityCheckData === undefined) {
        let warrningMsg = {
            labelName: "Please Select Date Range",
            labelKey: "",
        };
        dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    } else {
        if (
            availabilityCheckData.bkToDate === undefined ||
            availabilityCheckData.bkToDate === "" ||
            availabilityCheckData.bkToDate === null
        ) {
            let warrningMsg = {
                labelName: "Please Select Date Range",
                labelKey: "",
            };
            dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        } else {
            if ("bkApplicationNumber" in availabilityCheckData) {
                dispatch(
                    setRoute(
                        `/egov-services/applyparkcommunitycenter?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
                    )
                );
            } else {
                dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
            }
        }

        // if (
        //     availabilityCheckData.bkToDate === undefined ||
        //     availabilityCheckData.bkToDate === ""
        // ) {
        //     let warrningMsg = {
        //         labelName: "Please select Date RANGE",
        //         labelKey: "",
        //     };
        //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
        // } else if ("bkApplicationNumber" in availabilityCheckData) {
        //     // dispatch(
        //     //     setRoute(
        //     //         `/egov-services/applyparkcommunitycentre?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
        //     //     )
        //     // );
        //     dispatch(
        //         setRoute(
        //             `/egov-services/applyparkcommunitycentre?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
        //         )
        //     );
        // } else {
        //     dispatch(
        //         // setRoute(
        //         //     `/egov-services/applyparkcommunitycentre?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
        //         // )
        //         setRoute(`/egov-services/applyparkcommunitycentre`)
        //     );
        // }
    }
};

const callBackForResetCalender = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData !== undefined) {
        dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", null));
        dispatch(prepareFinalObject("availabilityCheckData.bkToDate", null));
    }
};

// const callBackForSearch = async (state, dispatch) => {
//     let isFormValid = false;
//     let hasFieldToaster = true;

//     let validatestepformflag = validatestepform(1);

//     isFormValid = validatestepformflag[0];
//     hasFieldToaster = validatestepformflag[1];

//     if (isFormValid !== false) {
//         let availabilityCheckData = get(
//             state,
//             "screenConfiguration.preparedFinalObject.availabilityCheckData"
//         );
//         // if (availabilityCheckData === undefined) {
//         //     dispatch(
//         //         toggleSnackbar(
//         //             true,
//         //             { labelName: "Please Select Booking Venue!", labelKey: "" },
//         //             "warning"
//         //         )
//         //     );
//         // } else {
//         if (
//             "bkSector" in availabilityCheckData &&
//             "bkBookingVenue" in availabilityCheckData
//         ) {
//             let bookingSector = availabilityCheckData.bkSector;
//             let bookingVenue = availabilityCheckData.bkBookingVenue;
//             let response = await getAvailabilityDataOSWMCC(
//                 bookingSector,
//                 bookingVenue
//             );

//             let responseStatus = get(response, "status", "");
//             if (responseStatus == "SUCCESS" || responseStatus == "success") {
//                 let data = response.data;
//                 let reservedDates = [];
//                 var daylist = [];
//                 data.map((dataitem) => {
//                     let start = dataitem.fromDate;
//                     let end = dataitem.toDate;
//                     daylist = getBetweenDays(start, end);
//                     daylist.map((v) => {
//                         reservedDates.push(v.toISOString().slice(0, 10));
//                     });
//                 });
//                 dispatch(
//                     prepareFinalObject(
//                         "availabilityCheckData.reservedDays",
//                         reservedDates
//                     )
//                 );
//             } else {
//                 let errorMessage = {
//                     labelName: "Something went wrong, Try Again later!",
//                     labelKey: "", //UPLOAD_FILE_TOAST
//                 };
//                 dispatch(toggleSnackbar(true, errorMessage, "error"));
//             }
//         }
//         // else {
//         //     let errorMessage = {
//         //         labelName: "Please fill all mandatory fields! new",
//         //         labelKey: "Please fill all mandatory fields! new",
//         //     };

//         //     dispatch(toggleSnackbar(true, errorMessage, "warning"));
//         // }
//         // }
//     } else {
//         let errorMessage = {
//             labelName: "Please fill all mandatory fields!",
//             labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
//         };

//         dispatch(toggleSnackbar(true, errorMessage, "warning"));
//     }
// };

// const callBackForVenue = async (state, dispatch) => {
//     let bkSector = get(
//         state,
//         "screenConfiguration.preparedFinalObject.availabilityCheckData.bkSector"
//     );
//     let bkBookingVenue = get(
//         state,
//         "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
//     );
//     let bkAreaRequired = get(
//         state,
//         "screenConfiguration.preparedFinalObject.Booking.bkAreaRequired"
//     );
//     try {
//         let responseImage = await getNewLocatonImages(bkSector, bkBookingVenue);
//         let responseImageStatus = get(responseImage, "status", "");
//         if (
//             responseImageStatus == "SUCCESS" ||
//             responseImageStatus == "success"
//         ) {
//             let documentsAndLocImages = responseImage.data;
//             let onlyLocationImages =
//                 documentsAndLocImages &&
//                 documentsAndLocImages.filter(
//                     (item) => item.documentType != "IDPROOF"
//                 );

//             let fileStoreIds =
//                 onlyLocationImages &&
//                 onlyLocationImages.map((item) => item.fileStoreId).join(",");
//             const fileUrlPayload =
//                 fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
//             let newLocationImagesPreview = [];
//             onlyLocationImages &&
//                 onlyLocationImages.forEach((item, index) => {
//                     newLocationImagesPreview[index] = {
//                         name:
//                             (fileUrlPayload &&
//                                 fileUrlPayload[item.fileStoreId] &&
//                                 decodeURIComponent(
//                                     fileUrlPayload[item.fileStoreId]
//                                         .split(",")[0]
//                                         .split("?")[0]
//                                         .split("/")
//                                         .pop()
//                                         .slice(13)
//                                 )) ||
//                             `Document - ${index + 1}`,
//                         fileStoreId: item.fileStoreId,
//                         link: Object.values(fileUrlPayload)[index],
//                         title: item.documentType,
//                     };
//                 });

//             dispatch(
//                 prepareFinalObject(
//                     "mccNewLocImagesPreview",
//                     newLocationImagesPreview
//                 )
//             );

//             let response = await getPerDayRateOSWMCC(bkSector, bkAreaRequired);
//             let responseStatus = get(response, "status", "");
//             if (responseStatus == "SUCCESS" || responseStatus == "success") {
//                 response.data.displayArea =
//                     response.data.areaFrom + " - " + response.data.areaTo;
//                 dispatch(prepareFinalObject("perDayRate", response.data));
//             }
//             // else {
//             //     let errorMessage = {
//             //         labelName: "Something went wrong, Try Again later!",
//             //         labelKey: "", //UPLOAD_FILE_TOAST
//             //     };
//             //     dispatch(toggleSnackbar(true, errorMessage, "error"));
//             // }
//         }
//         // else {
//         //     let errorMessage = {
//         //         labelName: "Something went wrong, Try Again later!",
//         //         labelKey: "", //UPLOAD_FILE_TOAST
//         //     };
//         //     dispatch(toggleSnackbar(true, errorMessage, "error"));
//         // }
//         showHideAdhocPopup(state, dispatch, "checkavailability_oswmcc");
//     } catch (error) {
//         console.log(error, "myerror");
//     }
// };

export const availabilityForm = getCommonCard({
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
                ...getCommonHeader({
                    labelName: "Check Open Space Availability",
                    labelKey: "BK_PCC_CHECK_AVAILABILITY_HEADER",
                }),
            },
        },
    },
    availabilityFields: getCommonContainer({
        bkBookingType: {
            uiFramework: "custom-containers",
            componentPath: "RadioGroupContainer",
            moduleName: "egov-services",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 6,
            },
            jsonPath: "availabilityCheckData.bkBookingType",
            props: {
                label: {
                    name: "Booking Type",
                    key: "BK_PCC_BOOKING_TYPE_LABEL",
                },
                buttons: [
                    {
                        labelName: "Community Center",
                        labelKey: "Community Center",
                        value: "Community Center",
                    },
                    {
                        label: "Parks",
                        labelKey: "Parks",
                        value: "Parks",
                    },
                ],
                jsonPath: "availabilityCheckData.bkBookingType",
                defaultValue: "Parks",
                required: true,
            },
            required: true,
            type: "array",
            beforeFieldChange: (action, state, dispatch) => {
                set(
                    state.screenConfiguration.screenConfig[
                        "checkavailability_pcc"
                    ],
                    "components.div.children.availabilityMediaCardWrapper.visible",
                    false
                );
                set(
                    state.screenConfiguration.screenConfig[
                        "checkavailability_pcc"
                    ],
                    "components.div.children.availabilityTimeSlotWrapper.visible",
                    false
                );
                set(
                    state.screenConfiguration.screenConfig[
                        "checkavailability_pcc"
                    ],
                    "components.div.children.availabilityCalendarWrapper.visible",
                    false
                );

                set(
                    state,
                    "screenConfiguration.screenConfig.checkavailability_pcc.components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector.props.value",
                    ""
                );

                // dispatch(
                //     handleField(
                //         "checkavailability_pcc",
                //         "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector",
                //         "props.value",
                //        ""
                //     )
                // );
            },
        },

        bkSector: {
            ...getSelectField({
                label: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_BOOKING_LOCALITY_LABEL",
                },

                placeholder: {
                    labelName: "Locality",
                    labelKey: "BK_PCC_BOOKING_LOCALITY_PLACEHOLDER",
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                },

                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "availabilityCheckData.bkSector",
                required: true,
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: async (action, state, dispatch) => {
                if (action.value) {
                    let availabilityCheckData = get(
                        state,
                        "screenConfiguration.preparedFinalObject.availabilityCheckData"
                    );

                    let bkBookingType =
                        availabilityCheckData !== undefined
                            ? availabilityCheckData.bkBookingType
                            : "Parks";

                    dispatch(
                        prepareFinalObject(
                            "availabilityCheckData.bkBookingType",
                            bkBookingType
                        )
                    );
                    dispatch(
                        prepareFinalObject(
                            "Booking.bkBookingType",
                            bkBookingType
                        )
                    );

                    set(
                        state.screenConfiguration.screenConfig[
                            "checkavailability_pcc"
                        ],
                        "components.div.children.availabilityMediaCardWrapper.visible",
                        true
                    );
                    set(
                        state.screenConfiguration.screenConfig[
                            "checkavailability_pcc"
                        ],
                        "components.div.children.availabilityCalendarWrapper.visible",
                        availabilityCheckData !== undefined && "bkBookingVenue" in availabilityCheckData ? true : false
                    );
                    set(
                        state.screenConfiguration.screenConfig[
                            "checkavailability_pcc"
                        ],
                        "components.div.children.availabilityTimeSlotWrapper.visible",
                        bkBookingType === "Parks" ? false : true
                    );
                    // set(
                    //     state.screenConfiguration.screenConfig[
                    //     "checkavailability_pcc"
                    //     ],
                    //     "components.div.children.availabilityCalendarWrapper.visible",
                    //     bkBookingType === "Parks" ? true : false
                    // );

                    let requestBody = {
                        venueType: bkBookingType,
                        sector: action.value,
                    };
                    let response = await getMasterDataPCC(requestBody);
                    let responseStatus = get(response, "status", "");
                    console.log(responseStatus, "responseStatus");
                    if (
                        responseStatus == "SUCCESS" ||
                        responseStatus == "success"
                    ) {
                        dispatch(
                            prepareFinalObject("masterData", response.data)
                        );
                    } else {
                        let errorMessage = {
                            labelName: "Something went wrong, Try Again later!",
                            labelKey: "", //UPLOAD_FILE_TOAST
                        };
                        dispatch(toggleSnackbar(true, errorMessage, "error"));
                    }
                }
            },
        },
        // bkFromDate: {
        //     ...getDateField({
        //         label: {
        //             labelName: "Booking Date",
        //             labelKey: "BK_PCC_FROM_DATE_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Booking Data",
        //             labelName: "BK_PCC_FROM_DATE_PLACEHOLDER",
        //         },
        //         // required: true,
        //         pattern: getPattern("Date"),
        //         jsonPath: "Booking.bkFromDate",
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         props: {
        //             className: "applicant-details-error",
        //             inputProps: {
        //                 min: getTodaysDateInYMD(),
        //                 max: getFinancialYearDates("yyyy-mm-dd").endDate,
        //             },
        //         },
        //         gridDefination: {
        //             xs: 12,
        //             sm: 6,
        //             md: 6,
        //         },
        //     }),
        // },
        // bkToDate: {
        //     ...getDateField({
        //         label: {
        //             labelName: "Booking Date",
        //             labelKey: "BK_PCC_TO_DATE_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Booking Data",
        //             labelName: "BK_PCC_TO_DATE_PLACEHOLDER",
        //         },
        //         // required: true,
        //         pattern: getPattern("Date"),
        //         jsonPath: "Booking.bkToDate",
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         props: {
        //             className: "applicant-details-error",
        //             inputProps: {
        //                 min: getTodaysDateInYMD(),
        //                 max: getFinancialYearDates("yyyy-mm-dd").endDate,
        //             },
        //         },
        //         gridDefination: {
        //             xs: 12,
        //             sm: 6,
        //             md: 6,
        //         },
        //     }),
        // },
    }),
    // availabilityActions: getCommonContainer({
    //     searchButton: {
    //         componentPath: "Button",
    //         props: {
    //             variant: "contained",
    //             color: "primary",
    //             style: {
    //                 minWidth: "200px",
    //                 height: "48px",
    //                 // marginRight: "16px",
    //             },
    //         },

    //         children: {
    //             submitButtonLabel: getLabel({
    //                 labelName: "Check Availability",
    //                 labelKey: "BK_OSWMCC_CHECK_AVAILABILITY_LABEL",
    //             }),
    //         },
    //         onClickDefination: {
    //             action: "condition",
    //             callBack: callBackForSearch,
    //         },
    //         visible: true,
    //     },
    //     resetButton: {
    //         componentPath: "Button",
    //         props: {
    //             variant: "outlined",
    //             color: "primary",
    //             style: {
    //                 minWidth: "200px",
    //                 height: "48px",
    //                 // marginRight: "16px",
    //                 marginLeft: "16px",
    //             },
    //         },

    //         children: {
    //             resetButtonLabel: getLabel({
    //                 labelName: "Reset",
    //                 labelKey: "BK_OSWMCC_BOOKING_CHECK_RESET_LABEL",
    //             }),
    //         },
    //         onClickDefination: {
    //             action: "condition",
    //             callBack: callBackForReset,
    //         },
    //         visible: true,
    //     },
    //     viewDetailsButton: {
    //         componentPath: "Button",
    //         props: {
    //             // variant: "outlined",
    //             color: "primary",
    //             style: {
    //                 minWidth: "200px",
    //                 height: "48px",
    //                 // marginRight: "16px",
    //                 marginLeft: "16px",
    //             },
    //         },
    //         children: {
    //             viewIcon: {
    //                 uiFramework: "custom-atoms",
    //                 componentPath: "Icon",
    //                 props: {
    //                     iconName: "remove_red_eye",
    //                 },
    //             },
    //             buttonLabel: getLabel({
    //                 labelName: "View Details",
    //                 labelKey: "View Details",
    //             }),
    //         },
    //         onClickDefination: {
    //             action: "condition",
    //             callBack: callBackForVenue,
    //         },
    //         visible: false,
    //     },
    // }),
});

export const availabilityMediaCard = getCommonCard({
    availabilityMedia: getCommonContainer({
        bookingCalendar: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-services",
            componentPath: "BookingMediaContainer",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 12,
            },
        },
    }),
});
export const availabilityTimeSlot = getCommonCard({
    availabilityMedia: getCommonContainer({
        bookingCalendar: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-services",
            componentPath: "BookingTimeSlot",
            gridDefination: {
                xs: 12,
                sm: 12,
                md: 12,
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
            gridDefination: {
                xs: 12,
                align: "right",
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
export const availabilityCalendar = getCommonCard({
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
                venueDataKey: "bkLocation",
            },
            children: {
                popup: {},
            },
        },
        actionButtons: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            gridDefination: {
                xs: 12,
            },
            props: {
                style: {
                    justifyContent: "flex-end",
                },
            },
            children: {
                resetButton: {
                    componentPath: "Button",
                    props: {
                        variant: "outlined",
                        color: "primary",
                        style: {
                            minWidth: "200px",
                            height: "48px",
                            marginTop: "10px",
                            marginRight: "16px",
                        },
                    },

                    children: {
                        submitButtonLabel: getLabel({
                            labelName: "RESET",
                            labelKey: "RESET",
                        }),
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: callBackForResetCalender,
                    },
                    visible: true,
                },
                bookButton: {
                    componentPath: "Button",
                    props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                            minWidth: "200px",
                            height: "48px",
                            marginTop: "10px",
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
            },
        },
    }),
});
