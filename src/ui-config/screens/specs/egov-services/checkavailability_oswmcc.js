import {
    getCommonContainer,
    getCommonHeader,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getCurrentFinancialYear,
    clearlocalstorageAppDetails,
    convertDateInYMD,
} from "../utils";
import {
    checkAvailabilitySearch,
    checkAvailabilityCalendar,
} from "./checkAvailabilityForm_oswmcc";
import { ImageLocationSummary } from "./summaryResource/imagesOfNewLocationOswmcc";
import { perDayRateSummary } from "./summaryResource/perDayRateSummaryBookingOSWMCC";
import { showHideAdhocPopup } from "../utils";
import {
    setapplicationNumber,
    lSRemoveItemlocal,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";
import { getAvailabilityDataOSWMCC, getBetweenDays } from "../utils";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import set from "lodash/set";

// const getMdmsData = async (action, state, dispatch) => {
//     try {
//         let payload = {};

//         payload.sector = [
//             {
//                 id: 1,
//                 code: "SECTOR-17",
//                 tenantId: "ch.chandigarh",
//                 name: "SECTOR-17",
//                 active: true,
//             },
//             {
//                 id: 2,
//                 code: "EG_SECTOR_34",
//                 tenantId: "ch.chandigarh",
//                 name: "EG_SECTOR_34",
//                 active: true,
//             },
//             {
//                 id: 2,
//                 code: "MANIMAJRA",
//                 tenantId: "ch.chandigarh",
//                 name: "MANIMAJRA",
//                 active: true,
//             },
//         ];
//         payload.bkBookingVenue = [];
//         //   payload.bkBookingVenue = [
//         //     { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
//         //     { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
//         //     { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
//         // ];

//         dispatch(prepareFinalObject("applyScreenMdmsData", payload));
//     } catch (e) {
//         console.log(e);
//     }
// };

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    moduleName: "Booking",
                    masterDetails: [
                        {
                            name: "Sector",
                        },
                    ],
                },
            ],
        },
    };
    try {
        let payloadMdms = null;
        payloadMdms = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );

        let payloadLocation = null;
        payloadLocation = await httpRequest(
            "post",
            "/bookings/newLocation/citizen/osujm/_all"
        );
        dispatch(prepareFinalObject("applyScreenMdmsData", payloadMdms.MdmsRes));
        dispatch(
            prepareFinalObject(
                "applyScreenMdmsData.Booking.sectorWiselocationsObject",
                payloadLocation.osujmNewlocationMap
            )
        );
    } catch (e) {
        console.log(e);
    }
};

const prepareEditFlow = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    if (applicationNumber) {
        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        setapplicationNumber(applicationNumber);
        setApplicationNumberBox(state, dispatch, applicationNumber);

        dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));
        dispatch(
            prepareFinalObject(
                "availabilityCheckData",
                response.bookingsModelList[0]
            )
        );

        const bkSector = response.bookingsModelList[0].bkSector
        const bkBookingVenue  = response.bookingsModelList[0].bkBookingVenue 
        let sectorWiselocationsObject = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData.Booking.sectorWiselocationsObject"
        );
    
        // get(
        //     action.screenConfig,
        //     "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
        //     true
        // );
        console.log(bkSector, "bkSector");
        console.log(bkBookingVenue, "bkBookingVenue");
        console.log(sectorWiselocationsObject, "sectorWiselocationsObject");
        const venueList = get(sectorWiselocationsObject, bkSector);
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



        let availabilityData = await getAvailabilityDataOSWMCC(
            response.bookingsModelList[0].bkSector,
            response.bookingsModelList[0].bkBookingVenue
        );

        if (availabilityData !== undefined) {
            let data = availabilityData.data;
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
            dispatch(
                toggleSnackbar(
                    true,
                    { labelName: "Please Try After Sometime!", labelKey: "" },
                    "warning"
                )
            );
        }

        let fileStoreIds = Object.keys(response.documentMap);
        let fileStoreIdsValue = Object.values(response.documentMap);
        if (fileStoreIds.length > 0) {
            let fileUrls =
                fileStoreIds.length > 0
                    ? await getFileUrlFromAPI(fileStoreIds)
                    : {};
            dispatch(
                prepareFinalObject("documentsUploadReduxOld.documents", [
                    {
                        fileName: fileStoreIdsValue[0],
                        fileStoreId: fileStoreIds[0],
                        fileUrl: fileUrls[fileStoreIds[0]],
                    },
                ])
            );
        }
    }
};
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Open Space within MCC jurisdiction`,
        labelKey: "BK_OSWMCC_APPLY",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: false,
    },
    
});

const screenConfig = {
    uiFramework: "material-ui",
    name: "checkavailability_oswmcc",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        getMdmsData(action, state, dispatch).then(response => {
            if (applicationNumber !== null) {
                set(
                    action.screenConfig,
                    "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                    true
                );
                prepareEditFlow(
                    state,
                    dispatch,
                    applicationNumber,
                    tenantId
                );
            }
        });

        

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
                id: "search",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 10,
                            },
                            ...header,
                        },
                    },
                },
                checkAvailabilitySearch: checkAvailabilitySearch,
                checkAvailabilityCalendar: checkAvailabilityCalendar,
                adhocDialog: {
                    uiFramework: "custom-containers-local",
                    moduleName: "egov-services",
                    componentPath: "DialogContainer",
                    props: {
                        open: false,
                        maxWidth: "lg",
                        screenKey: "checkavailability_oswmcc",
                    },
                    children: {
                        popup: getCommonContainer({
                            venuebasedSummary: {
                                uiFramework: "custom-atoms",
                                componentPath: "Card",
                                props: {
                                    style: {
                                        width: "100%",
                                        margin: "24px 0 0",
                                        backgroundColor: "#fff",
                                        padding: "0 24px 24px",
                                        // borderRadius: 0,
                                        // boxShadow: "none",
                                        // overflow: "visible",
                                    },
                                },
                                children: {
                                    perDayRateSummary,
                                    ImageLocationSummary,
                                },
                                // visible: false,
                            },
                        }),
                    },
                },
            },
        },
    },
};

export default screenConfig;
