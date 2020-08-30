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

const callBackForReset = (state, dispatch, action) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );

    if (availabilityCheckData !== undefined) {
        if (availabilityCheckData.bkSector) {
            dispatch(
                handleField(
                    "checkavailability_oswmcc",
                    "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkSector",
                    "props.value",
                    undefined
                )
            );
        }
        if (availabilityCheckData.bkBookingVenue) {
            dispatch(
                handleField(
                    "checkavailability_oswmcc",
                    "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.bkBookingVenue",
                    "props.value",
                    undefined
                )
            );
        }
        set(
            state.screenConfiguration.screenConfig["checkavailability_oswmcc"],
            "components.div.children.availabilityForm.children.cardContent.children.availabilitySearchContainer.children.viewDetailsButton.visible",
            false
        );
        dispatch(prepareFinalObject("availabilityCheckData", undefined));
    }
    // if (availabilityCheckData.bkFromDate) {
    //     dispatch(prepareFinalObject("availabilityCheckData.bkFromDate", ""))
    // }
    // if (availabilityCheckData.bkToDate) {
    //     dispatch(prepareFinalObject("availabilityCheckData.bkToDate", ""))
    // }
    // if (availabilityCheckData.reservedDays) {
    //     dispatch(prepareFinalObject("availabilityCheckData.reservedDays", []))
    // }

    // const actionDefination = [
    //     {
    //         path:
    //             "components.div.children.availabilityCalendar.children.cardContent.children.Calendar.children.bookingCalendar.props",
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
    dispatch(setRoute(`/egov-services/applyparkcommunitycenter`));
    // let availabilityCheckData =
    //     state.screenConfiguration.preparedFinalObject.availabilityCheckData;
    // if (availabilityCheckData === undefined) {
    //     let warrningMsg = {
    //         labelName: "Please Select Date Range",
    //         labelKey: "",
    //     };
    //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    // } else {
    //     if (
    //         availabilityCheckData.bkToDate === undefined ||
    //         availabilityCheckData.bkToDate === "" ||
    //         availabilityCheckData.bkToDate === null
    //     ) {
    //         let warrningMsg = {
    //             labelName: "Please Select Date Range",
    //             labelKey: "",
    //         };
    //         dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    //     } else {
    //         if ("bkApplicationNumber" in availabilityCheckData) {
    //             dispatch(
    //                 setRoute(
    //                     `/egov-services/applyparkcommunitycentre?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
    //                 )
    //             );
    //         } else {
    //             dispatch(setRoute(`/egov-services/applyparkcommunitycentre`));
    //         }
    //     }

    //     // if (
    //     //     availabilityCheckData.bkToDate === undefined ||
    //     //     availabilityCheckData.bkToDate === ""
    //     // ) {
    //     //     let warrningMsg = {
    //     //         labelName: "Please select Date RANGE",
    //     //         labelKey: "",
    //     //     };
    //     //     dispatch(toggleSnackbar(true, warrningMsg, "warning"));
    //     // } else if ("bkApplicationNumber" in availabilityCheckData) {
    //     //     // dispatch(
    //     //     //     setRoute(
    //     //     //         `/egov-services/applyparkcommunitycentre?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}&fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
    //     //     //     )
    //     //     // );
    //     //     dispatch(
    //     //         setRoute(
    //     //             `/egov-services/applyparkcommunitycentre?applicationNumber=${availabilityCheckData.bkApplicationNumber}&tenantId=${availabilityCheckData.tenantId}&businessService=${availabilityCheckData.businessService}`
    //     //         )
    //     //     );
    //     // } else {
    //     //     dispatch(
    //     //         // setRoute(
    //     //         //     `/egov-services/applyparkcommunitycentre?fromDate=${availabilityCheckData.bkFromDate}&toDate=${availabilityCheckData.bkToDate}&sector=${availabilityCheckData.bkSector}&venue=${availabilityCheckData.bkBookingVenue}`
    //     //         // )
    //     //         setRoute(`/egov-services/applyparkcommunitycentre`)
    //     //     );
    //     // }
    // }
};

const callBackForAddNewLocation = async (state, dispatch) => {
    const addLocationURL = `/egov-services/applyNewLocationUnderMCC`;
    dispatch(setRoute(addLocationURL));
};

const callBackForSearch = async (state, dispatch) => {
    let isFormValid = false;
    let hasFieldToaster = true;

    let validatestepformflag = validatestepform(1);

    isFormValid = validatestepformflag[0];
    hasFieldToaster = validatestepformflag[1];

    if (isFormValid !== false) {
        let availabilityCheckData = get(
            state,
            "screenConfiguration.preparedFinalObject.availabilityCheckData"
        );
        // if (availabilityCheckData === undefined) {
        //     dispatch(
        //         toggleSnackbar(
        //             true,
        //             { labelName: "Please Select Booking Venue!", labelKey: "" },
        //             "warning"
        //         )
        //     );
        // } else {
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
        }
        // else {
        //     let errorMessage = {
        //         labelName: "Please fill all mandatory fields! new",
        //         labelKey: "Please fill all mandatory fields! new",
        //     };

        //     dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // }
        // }
    } else {
        let errorMessage = {
            labelName: "Please fill all mandatory fields!",
            labelKey: "BK_ERR_FILL_ALL_MANDATORY_FIELDS",
        };

        dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
};

const callBackForVenue = async (state, dispatch) => {
    let bkSector = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkSector"
    );
    let bkBookingVenue = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkBookingVenue"
    );
    let bkAreaRequired = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkAreaRequired"
    );
    try {
        let responseImage = await getNewLocatonImages(bkSector, bkBookingVenue);
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
                onlyLocationImages.map((item) => item.fileStoreId).join(",");
            const fileUrlPayload =
                fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
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
                        link: Object.values(fileUrlPayload)[index],
                        title: item.documentType,
                    };
                });

            dispatch(
                prepareFinalObject(
                    "mccNewLocImagesPreview",
                    newLocationImagesPreview
                )
            );

            let response = await getPerDayRateOSWMCC(bkSector, bkAreaRequired);
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                response.data.displayArea =
                    response.data.areaFrom + " - " + response.data.areaTo;
                dispatch(prepareFinalObject("perDayRate", response.data));
            }
            // else {
            //     let errorMessage = {
            //         labelName: "Something went wrong, Try Again later!",
            //         labelKey: "", //UPLOAD_FILE_TOAST
            //     };
            //     dispatch(toggleSnackbar(true, errorMessage, "error"));
            // }
        }
        // else {
        //     let errorMessage = {
        //         labelName: "Something went wrong, Try Again later!",
        //         labelKey: "", //UPLOAD_FILE_TOAST
        //     };
        //     dispatch(toggleSnackbar(true, errorMessage, "error"));
        // }
        showHideAdhocPopup(state, dispatch, "checkavailability_oswmcc");
    } catch (error) {
        console.log(error, "myerror");
    }
};

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
                        "bkBookingType" in availabilityCheckData
                            ? availabilityCheckData.bkBookingType
                            : "Parks";
                    let requestBody = {
                        bookingType: bkBookingType,
                        sector: availabilityCheckData.bkSector,
                    };
                    let response = await getMasterDataPCC(requestBody);
                    let responseStatus = get(response, "status", "");
                    // if (
                    //     responseStatus == "SUCCESS" ||
                    //     responseStatus == "success"
                    // ) {

                    let masterData = {
                        status: "200",
                        message:
                            "Park And Community Master Data Fetched Successfully ",
                        data: [
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c085",
                                sccid: "2054",
                                scid: "1005",
                                sector: "SECTOR-1",
                                x: "417.35",
                                y: "209",
                                amount: "1718",
                                dimensionSqrYards: "1491",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name:
                                    "PARK NO 5 NEAR H NO 21 SECTOR 2 CHANDIGARH",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c086",
                                sccid: "2058",
                                scid: "1005",
                                sector: "SECTOR-2",
                                x: "500.35",
                                y: "253",
                                amount: "1718",
                                dimensionSqrYards: "19380",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name:
                                    "PARK NO 6 NEAR V-3 Road Sector 11 Road SECTOR 2 CHANDIGARH",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c087",
                                sccid: "3817",
                                scid: "1005",
                                sector: "SECTOR-1",
                                x: "242.35",
                                y: "394",
                                amount: "1710",
                                dimensionSqrYards: "4940",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "PARK NO 1 NEAR H NO 2 SEC 2 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: false,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c088",
                                sccid: "3831",
                                scid: "1005",
                                sector: "SECTOR-1",
                                x: "519.35",
                                y: "318",
                                amount: "1718",
                                dimensionSqrYards: "1105",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "PARK NO 2 NEAR H NO 68 SEC 2 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c089",
                                sccid: "3832",
                                scid: "1005",
                                sector: "SECTOR-1",
                                x: "213.35",
                                y: "431",
                                amount: "1718",
                                dimensionSqrYards: "7236",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "PARK NO 3 NEAR H NO 88-91 SEC 2 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: false,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c090",
                                sccid: "3833",
                                scid: "1005",
                                sector: "SECTOR-1",
                                x: "864.35",
                                y: "416",
                                amount: "1718",
                                dimensionSqrYards: "1000",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "PARK NO 4 NEAR H NO 87 SEC 2 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: false,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c091",
                                sccid: "1025",
                                scid: "1006",
                                sector: "SECTOR-1",
                                x: "892.35",
                                y: "519",
                                amount: "1710",
                                dimensionSqrYards: "90604",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "BOUGANVILLEA GARDEN SEC 3 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c092",
                                sccid: "1026",
                                scid: "1007",
                                sector: "SECTOR-1",
                                x: "755.35",
                                y: "632",
                                amount: "1718",
                                dimensionSqrYards: "2188",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name:
                                    "Park No 4 Opposite House No 53-54 Sector 4 Chandigarh",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c093",
                                sccid: "1023",
                                scid: "1007",
                                sector: "SECTOR-2",
                                x: "660.35",
                                y: "663",
                                amount: "1718",
                                dimensionSqrYards: "23230",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name:
                                    "Park No 2 In Front of House No 3 Sector 4 Chandigarh",
                                radius: "50",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c094",
                                sccid: "1024",
                                scid: "1007",
                                sector: "SECTOR-2",
                                x: "261.35",
                                y: "772",
                                amount: "1718",
                                dimensionSqrYards: "3320",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name:
                                    "Park No 3 Adjoining House No 56 Sector 4 Chandigarh",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: true,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                            {
                                id: "fabc3ff6-70d8-4ae6-8ac7-00c9c714c095",
                                sccid: "3815",
                                scid: "1007",
                                sector: "SECTOR-1",
                                x: "564.35",
                                y: "770",
                                amount: "1718",
                                dimensionSqrYards: "6808",
                                rent: "2420",
                                cleaningCharges: "1000",
                                surcharge: "18",
                                luxuryTax: "0",
                                name: "PARK NO 1 NEAR H.NO 35 SEC 4 CHD",
                                radius: "20",
                                locationChangeAmount: "150",
                                isActive: false,
                                utgstRate: "9",
                                cgstRate: "9",
                                refundabelSecurity: "0",
                                normalType: "N",
                                reviserate1: "200",
                                oldrent1: "2000",
                                rentNextSession: "2420",
                                imagePath: "",
                                venueType: "Parks",
                                bookingAllowedFor: "",
                            },
                        ],
                    };
                    dispatch(prepareFinalObject("masterData", masterData.data));

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
                        true
                    );
                    // }
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
            },
            children: {
                popup: {},
            },
            children: {
                popup: {},
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
