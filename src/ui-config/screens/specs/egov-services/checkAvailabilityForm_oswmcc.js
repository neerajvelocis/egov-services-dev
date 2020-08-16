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
    getBetweenDays,
} from "../utils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";

const callBackForReset = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    dispatch(prepareFinalObject("availabilityCheckData", {}));
    // if (availabilityCheckData.bkSector) {
    //     dispatch(
    //         handleField(
    //             "checkavailability",
    //             "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
    //             "props.value",
    //             ""
    //         )
    //     );
    // }
    // if (availabilityCheckData.bkFromDate) {
    //     dispatch(
    //         handleField(
    //             "checkavailability",
    //             "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkSector",
    //             "props.value",
    //             ""
    //         )
    //     );
    // }
    // if (availabilityCheckData.reservedDays) {
    //     dispatch(
    //         handleField(
    //             "checkavailability",
    //             "components.div.children.checkAvailabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar",
    //             "props.reservedDays",
    //             []
    //         )
    //     );
    // }

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
            // dispatch(
            //     setRoute(
            //         `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
            //     )
            // );
            dispatch(
                setRoute(
                    `/egov-services/applyopenspacewmcc?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
                )
            );
        } else {
            dispatch(
                // setRoute(
                //     `/egov-services/applyopenspacewmcc?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
                // )
                setRoute(`/egov-services/applyopenspacewmcc`)
            );
        }
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
    if (availabilityCheckData === undefined) {
        dispatch(
            toggleSnackbar(
                true,
                { labelName: "Please Select Booking Venue!", labelKey: "" },
                "warning"
            )
        );
    } else {
        if (
            "bkSector" in availabilityCheckData &&
            "bkBookingVenue" in availabilityCheckData
        ) {
            let bookingSector = availabilityCheckData.bkSector;
            let bookingVenue = availabilityCheckData.bkBookingVenue;
            let response = await getAvailabilityDataOSWMCC(
                bookingSector,
                bookingVenue
            );

            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
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
            } else {
                let errorMessage = {
                    labelName: "Something went wrong, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
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
                    // variant: "contained",
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
                    addIcon: {
                        uiFramework: "custom-atoms",
                        componentPath: "Icon",
                        props: {
                            iconName: "add_location_alt",
                        },
                    },
                    buttonLabel: getLabel({
                        labelName: "Add New Location",
                        labelKey: "BK_OSWMCC_NEW_LOCATION_LABEL",
                    }),
                },
                onClickDefination: {
                    action: "condition",
                    callBack: callBackForAddNewLocation,
                },
                visible: true,
            },
        },
    },
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

                sourceJsonPath: "applyScreenMdmsData.Booking.Sector",
                jsonPath: "availabilityCheckData.bkSector",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    // disabled: true
                },
            }),
            beforeFieldChange: (action, state, dispatch) => {
                // alert("in sector")
                console.log("action.value", action.value);
                if (action.value) {
                const bkBookingVenue = get(
                    state,
                    "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
                );
                const sectorWiselocationsObject = get(
                    state,
                    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.sectorWiselocationsObject"
                );
                const venueList = get(sectorWiselocationsObject, action.value);
                console.log(venueList, "venueListNew");
                venueList !== undefined && dispatch(
                    prepareFinalObject(
                        "applyScreenMdmsData.Booking.venueList",
                        venueList 
                    )
                );
                dispatch(
                    handleField(
                        "checkavailability_oswmcc",
                        "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
                        "props.disabled",
                        false
                    )
                );

                dispatch(
                    handleField(
                        "checkavailability_oswmcc",
                        "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
                        "props.value",
                        bkBookingVenue === undefined ? null : bkBookingVenue
                    )
                );
                }
            },
            // afterFieldChange : (action, state, dispatch) => {
            //     alert("in after sector")
            // }
        },
        bkBookingVenue: {
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

                sourceJsonPath: "applyScreenMdmsData.Booking.venueList",
                jsonPath: "availabilityCheckData.bkBookingVenue",
                required: true,
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true,
                },
            }),
            beforeFieldChange: async (action, state, dispatch) => {
                // alert("in venue")
                if (action.value) {
                    const venueList = get(
                        state,
                        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.venueList"
                    );
                    const selectedVenue = venueList !== undefined &&venueList.filter((el) => el.name == action.value)
                    const bkAreaRequired = selectedVenue.length > 0 ? selectedVenue[0].areRequirement : "";
                    const bkSector = get(
                        state,
                        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkSector"
                    );
                    dispatch(
                        prepareFinalObject(
                            "Booking.bkAreaRequired",
                            bkAreaRequired
                        )
                    );


                    let responseImage = await getNewLocatonImages(
                        bkSector,
                        action.value
                    );
                    let responseImageStatus = get(responseImage, "status", "");
                    if (
                        responseImageStatus == "SUCCESS" ||
                        responseImageStatus == "success"
                    ) {
                        let documentsAndLocImages = responseImage.data;
                        let onlyLocationImages =
                            documentsAndLocImages &&
                            documentsAndLocImages.filter(
                                (item) => item.documentType != "IDPROOF"
                            );

                        let fileStoreIds =
                            onlyLocationImages &&
                            onlyLocationImages
                                .map((item) => item.fileStoreId)
                                .join(",");
                        const fileUrlPayload =
                            fileStoreIds &&
                            (await getFileUrlFromAPI(fileStoreIds));
                        let newLocationImagesPreview = [];
                        onlyLocationImages &&
                            onlyLocationImages.forEach((item, index) => {
                                newLocationImagesPreview[index] = {
                                    name:
                                        (fileUrlPayload &&
                                            fileUrlPayload[item.fileStoreId] &&
                                            decodeURIComponent(
                                                fileUrlPayload[item.fileStoreId]
                                                    .split(",")[0]
                                                    .split("?")[0]
                                                    .split("/")
                                                    .pop()
                                                    .slice(13)
                                            )) ||
                                        `Document - ${index + 1}`,
                                    fileStoreId: item.fileStoreId,
                                    link: Object.values(fileUrlPayload)[
                                        index
                                    ],
                                    title: item.documentType,
                                    // tenantId: item.tenantId,
                                    // id: item.id,
                                };
                            });
    

                        dispatch(
                            prepareFinalObject(
                                "mccNewLocImagesPreview",
                                newLocationImagesPreview
                            )
                        );

                        let response = await getPerDayRateOSWMCC(
                            bkSector,
                            bkAreaRequired
                        );
                        let responseStatus = get(response, "status", "");
                        if (
                            responseStatus == "SUCCESS" ||
                            responseStatus == "success"
                        ) {
                            set(
                                state.screenConfiguration.screenConfig[
                                    "checkavailability_oswmcc"
                                ],
                                "components.div.children.checkAvailabilitySearch.children.cardContent.children.availabilitySearchContainer.children.viewDetailsButton.visible",
                                true
                            );
                            dispatch(
                                prepareFinalObject("perDayRate", response.data)
                            );
                        } else {
                            let errorMessage = {
                                labelName:
                                    "Something went wrong, Try Again later!",
                                labelKey: "", //UPLOAD_FILE_TOAST
                            };
                            dispatch(
                                toggleSnackbar(true, errorMessage, "error")
                            );
                        }
                    } else {
                        let errorMessage = {
                            labelName: "Something went wrong, Try Again later!",
                            labelKey: "", //UPLOAD_FILE_TOAST
                        };
                        dispatch(toggleSnackbar(true, errorMessage, "error"));
                    }
                }
            },
            // afterFieldChange : (action, state, dispatch) => {
            //     alert("in after venue")
            // }
        },
        searchButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    // marginRight: "16px",
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
        viewDetailsButton: {
            componentPath: "Button",
            props: {
                // variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    // marginRight: "16px",
                    marginLeft: "16px",
                },
            },
            children: {
                viewIcon: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                        iconName: "remove_red_eye",
                    },
                },
                buttonLabel: getLabel({
                    labelName: "View Details",
                    labelKey: "View Details",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) =>
                    showHideAdhocPopup(
                        state,
                        dispatch,
                        "checkavailability_oswmcc"
                    ),
            },
            visible: false,
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
        // dummyDiv: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Div",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 12,
        //         md: 9,
        //     },
        //     visible: true,
        //     props: {
        //         disabled: true,
        //     },
        // },
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
