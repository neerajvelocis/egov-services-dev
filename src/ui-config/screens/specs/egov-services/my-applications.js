import { fetchData } from "./searchResource/citizenSearchFunctions";
import {
    getCommonContainer,
    getCommonHeader,
    getLabel,
    getCommonSubHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    setapplicationType,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { searchForm } from "./searchResource/searchForm";
import { httpRequest } from "../../../../ui-utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
// const header = getCommonHeader(
//     {
//         labelName: "My Applications",
//         labelKey: "MY_BK_APPLICATIONS_HEADER",
//     },
//     {
//         classes: {
//             root: "common-header-cont",
//         },
//     }
// );

const header = getCommonContainer({
    header: getCommonHeader(
        {
            labelName: `My Applications`,
            labelKey: "MY_BK_APPLICATIONS_HEADER",
        }
    ),
});

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
                        {
                            name: "CityType",
                        },
                        {
                            name: "PropertyType",
                        },
                        {
                            name: "Area",
                        },
                        {
                            name: "Duration",
                        },
                        {
                            name: "Category",
                        },
                        {
                            name: "Documents",
                        },
                    ],
                },
            ],
        },
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        // console.log(payload.MdmsRes, "mdmsRes");
        payload.MdmsRes.Booking.bookingType = [
            {
                id: 1,
                code: "OSBM",
                tenantId: "ch.chandigarh",
                name: "Open Space",
                active: true,
            },
            {
                id: 2,
                code: "WATER_TANKERS",
                tenantId: "ch.chandigarh",
                name: "Water Tankers",
                active: true,
            },
        ];
        payload.MdmsRes.Booking.applicationStatus = [
            {
                id: 1,
                code: "PENDINGAPPROVAL",
                tenantId: "ch.chandigarh",
                name: "PENDINGAPPROVAL",
                active: true,
            },
            {
                id: 2,
                code: "PENDINGPAYMENT",
                tenantId: "ch.chandigarh",
                name: "PENDINGPAYMENT",
                active: true,
            },
            {
                id: 3,
                code: "REJECTED",
                tenantId: "ch.chandigarh",
                name: "REJECTED",
                active: true,
            },
            {
                id: 4,
                code: "APPROVED",
                tenantId: "ch.chandigarh",
                name: "APPROVED",
                active: true,
            },
            {
                id: 5,
                code: "PENDINGASSIGNMENTDRIVER",
                tenantId: "ch.chandigarh",
                name: "PENDINGASSIGNMENTDRIVER",
                active: true,
            },
            {
                id: 6,
                code: "DELIVERED",
                tenantId: "ch.chandigarh",
                name: "DELIVERED",
                active: true,
            },
            {
                id: 7,
                code: "NOTDELIVERED",
                tenantId: "ch.chandigarh",
                name: "NOTDELIVERED",
                active: true,
            },
        ];
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

const callBackForMyNewLocationApps = async (state, dispatch) => {
    const myNewLocationAppsURL = `/egov-services/my-newlocation-apps`;
    dispatch(setRoute(myNewLocationAppsURL));
};
const screenConfig = {
    uiFramework: "material-ui",
    name: "my-applications",
    beforeInitScreen: (action, state, dispatch) => {
        // setapplicationType("MyBooking");
        getMdmsData(action, state, dispatch).then((response) => {
            // prepareDocumentsUploadData(state, dispatch, "apply_osbm");
            fetchData(action, state, dispatch);
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
                                xs: 8,
                                sm: 8,
                            },
                            ...header,
                        },
                        addNewLocButton: {
                            componentPath: "Button",
                            props: {
                                variant: "contained",
                                color: "primary",
                                style: {
                                    // marginTop: "-10px",
                                    // marginRight: "-18px",
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
                                    labelName: "My New Location Requests",
                                    labelKey: "BK_OSWMCC_MY_LOCATION_REQUESTS",
                                }),
                            },
                            onClickDefination: {
                                action: "condition",
                                callBack: callBackForMyNewLocationApps,
                            },
                            visible: true,
                        },
                    },
                },
                applicationSearch: {
                    uiFramework: "custom-atoms",
                    componentPath: "Form",
                    props: {
                        id: "apply_form1",
                        style: {
                            marginLeft: 8,
                            marginRight: 8,
                        },
                    },
                    children: {
                        searchForm,
                    },
                },
                applicationsCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "SingleApplication",
                    visible: true,
                    props: {
                        contents: [
                            {
                                label: "MY_BK_APPLICATION_NUMBER_LABEL",
                                jsonPath: "bkApplicationNumber",
                            },
                            {
                                label: "MY_BK_APPLICATION_STATUS_LABEL",
                                jsonPath: "bkApplicationStatus",
                            },
                            {
                                label: "MY_BK_APPLICATION_TYPE_LABEL",
                                jsonPath: "bkBookingType",
                            },
                        ],
                        moduleName: "MyBooking",
                        homeURL: "/egov-services/applyservices",
                    },
                },
            },
        },
        // header: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Container",
        //   props: {
        //     style: { marginBottom: "10px" },
        //   },
        //   children: {
        //     header: {
        //       // gridDefination: {
        //       //   xs: 8,
        //       // },
        //       ...getCommonHeader({
        //         labelName: "My Applications",
        //         labelKey: "MY_BK_APPLICATIONS_HEADER",
        //       }),
        //     },
        //     addNewLocButton: {
        //       componentPath: "Button",
        //       props: {
        //         variant: "contained",
        //         color: "primary",
        //         style: {
        //           // marginTop: "-10px",
        //           marginRight: "-18px",
        //         },
        //       },
        //       gridDefination: {
        //         xs: 4,
        //         align: "right",
        //       },
        //       children: {
        //         // editIcon: {
        //         //     uiFramework: "custom-atoms",
        //         //     componentPath: "Icon",
        //         //     props: {
        //         //         iconName: "edit",
        //         //     },
        //         // },
        //         buttonLabel: getLabel({
        //           labelName: "My New Location Requests",
        //           labelKey: "BK_OSWMCC_MY_LOCATION_REQUESTS",
        //         }),
        //       },
        //       onClickDefination: {
        //         action: "condition",
        //         callBack: callBackForMyNewLocationApps,
        //       },
        //       visible: true,
        //     },
        //   },
        // // },
        // div: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Div",
        //     children: {
        //         applicationSearch: {
        //             uiFramework: "custom-atoms",
        //             componentPath: "Form",
        //             props: {
        //                 id: "apply_form1",
        //                 style: {
        //                     marginLeft: 8,
        //                     marginRight: 8,
        //                 },
        //             },
        //             children: {
        //                 searchForm,
        //             },
        //         },
        //         applicationsCard: {
        //             uiFramework: "custom-molecules",
        //             componentPath: "SingleApplication",
        //             visible: true,
        //             props: {
        //                 contents: [
        //                     {
        //                         label: "MY_BK_APPLICATION_NUMBER_LABEL",
        //                         jsonPath: "bkApplicationNumber",
        //                     },
        //                     {
        //                         label: "MY_BK_APPLICATION_STATUS_LABEL",
        //                         jsonPath: "bkApplicationStatus",
        //                     },
        //                     {
        //                         label: "MY_BK_APPLICATION_TYPE_LABEL",
        //                         jsonPath: "bkBookingType",
        //                     },
        //                 ],
        //                 moduleName: "MyBooking",
        //                 homeURL: "/egov-services/applyservices",
        //             },
        //         },
        //     },
        // },
    },
};

export default screenConfig;
