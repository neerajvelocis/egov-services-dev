import {
    getCommonContainer,
    getCommonHeader,
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
import {
    setapplicationNumber,
    lSRemoveItemlocal,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";
import { getAvailabilityData, getBetweenDays } from "../utils";

const getMdmsData = async (action, state, dispatch) => {
    try {
        let payload = {};

        payload.sector = [
            {
                id: 1,
                code: "SECTOR-17",
                tenantId: "ch.chandigarh",
                name: "SECTOR-17",
                active: true,
            },
            {
                id: 2,
                code: "EG_SECTOR_34",
                tenantId: "ch.chandigarh",
                name: "EG_SECTOR_34",
                active: true,
            },
            {
                id: 2,
                code: "MANIMAJRA",
                tenantId: "ch.chandigarh",
                name: "MANIMAJRA",
                active: true,
            },
        ];
        payload.bkBookingVenue = [];
        //   payload.bkBookingVenue = [
        //     { id: 1, code: 'Choda Mod', tenantId: 'ch.chandigarh', name: 'Choda Mod', active: true },
        //     { id: 2, code: 'Pari Chok', tenantId: 'ch.chandigarh', name: 'pari_chok', active: true },
        //     { id: 2, code: 'Cricket Ground', tenantId: 'ch.chandigarh', name: 'Cricket_Ground', active: true }
        // ];

        dispatch(prepareFinalObject("applyScreenMdmsData", payload));
    } catch (e) {
        console.log(e);
    }
};

// const getMdmsData = async (action, state, dispatch) => {
// 	alert("this")
//     let tenantId = getTenantId().split(".")[0];
//     let mdmsBody = {
//         MdmsCriteria: {
//             tenantId: tenantId,
//             moduleDetails: [
//                 {
//                     moduleName: "tenant",
//                     masterDetails: [
//                         {
//                             name: "tenants",
//                         },
//                     ],
//                 },
//                 {
//                     moduleName: "Booking",
//                     masterDetails: [
//                         {
//                             name: "Commerical_Ground_Cat",
//                         },
//                     ],
//                 },
//             ],
//         },
//     };
//     try {
//         let payload = null;
//         payload = await httpRequest(
//             "post",
//             "/egov-mdms-service/v1/_search",
//             "_search",
//             [],
//             mdmsBody
// 		);
// 		console.log(payload, "myPayload");
// 		// payload.sector = [
//         //     {
//         //         id: 1,
//         //         code: "SECTOR-17",
//         //         tenantId: "ch.chandigarh",
//         //         name: "SECTOR-17",
//         //         active: true,
//         //     },
//         //     {
//         //         id: 2,
//         //         code: "EG_SECTOR_34",
//         //         tenantId: "ch.chandigarh",
//         //         name: "EG_SECTOR_34",
//         //         active: true,
//         //     },
//         //     {
//         //         id: 2,
//         //         code: "MANIMAJRA",
//         //         tenantId: "ch.chandigarh",
//         //         name: "MANIMAJRA",
//         //         active: true,
//         //     },
//         // ];
//         dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
//     } catch (e) {
//         console.log(e);
//     }
// };

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

        let availabilityData = await getAvailabilityData(
            response.bookingsModelList[0].bkSector
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

        // let fileStoreIds = Object.keys(response.documentMap);
        // let fileStoreIdsValue = Object.values(response.documentMap);
        // if (fileStoreIds.length > 0) {
        //     let fileUrls =
        //         fileStoreIds.length > 0
        //             ? await getFileUrlFromAPI(fileStoreIds)
        //             : {};
        //     dispatch(
        //         prepareFinalObject("documentsUploadReduxOld.documents", [
        //             {
        //                 fileName: fileStoreIdsValue[0],
        //                 fileStoreId: fileStoreIds[0],
        //                 fileUrl: fileUrls[fileStoreIds[0]],
        //             },
        //         ])
        //     );
        // }
    }
};
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Commercial Ground`,
        labelKey: "BK_CGB_APPLY",
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
        getMdmsData(action, state, dispatch).then((response) => {
            const sectorWiselocationsObject = {
                "SECTOR-17": [
                    {
                        id: 1,
                        code: "RamLila Ground",
                        tenantId: "ch.chandigarh",
                        name: "RamLila_Ground",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Mohalla RamKishan",
                        tenantId: "ch.chandigarh",
                        name: "Mohalla_RamKishan",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Guard Enclave",
                        tenantId: "ch.chandigarh",
                        name: "Guard_Enclave",
                        active: true,
                    },
                ],
                "EG_SECTOR_34": [
                    {
                        id: 1,
                        code: "Choda Mod",
                        tenantId: "ch.chandigarh",
                        name: "Choda Mod",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Pari Chok",
                        tenantId: "ch.chandigarh",
                        name: "pari_chok",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Cricket Ground",
                        tenantId: "ch.chandigarh",
                        name: "Cricket_Ground",
                        active: true,
                    },
                ],
                "MANIMAJRA": [
                    {
                        id: 1,
                        code: "kakrala",
                        tenantId: "ch.chandigarh",
                        name: "kakrala",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Buldapur",
                        tenantId: "ch.chandigarh",
                        name: "Buldapur",
                        active: true,
                    },
                    {
                        id: 2,
                        code: "Ithera",
                        tenantId: "ch.chandigarh",
                        name: "Ithera",
                        active: true,
                    },
                ],
            };
            dispatch(
                prepareFinalObject(
                    "sectorWiselocationsObject",
                    sectorWiselocationsObject
                )
            );
        });

        if (applicationNumber !== null) {
            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(state, dispatch, applicationNumber, tenantId);
        }


        return action;
    },
    components: {
        headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
                id: "search",
            },
            children: {
                checkAvailabilitySearch,
                checkAvailabilityCalendar,
            },
        },
    },
};

export default screenConfig;
