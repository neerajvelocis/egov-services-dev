import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader, getLabel, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType, getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { searchDetails } from "./searchResource/searchForm";
import { httpRequest } from "../../../../ui-utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

// const header = getCommonHeader(
//   {
//     labelName: "My Applications",
//     labelKey: "MY_BK_APPLICATIONS",
//   },
//   {
//     classes: {
//       root: "common-header-cont",
//     },
//   }
// );

const getMdmsData = async (action, state, dispatch) => {
  alert("in mdms")
  let tenantId = getOPMSTenantId().split(".")[0];
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
    console.log(payload, "mdmsres");
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e, "errorcall");
  }
};

export const callBackForPrevious = (state, dispatch) => {
  alert("on click")
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType("Booking");
    getMdmsData(action, state, dispatch)
    // .then((response) => {
      // prepareDocumentsUploadData(state, dispatch, "apply_osb");
    fetchData(action, state, dispatch);
    // });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        // header: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Container",
        //   props: {
        //     style: { marginBottom: "10px" }
        //   },
        //   children: {
        //     header: {
        //       gridDefination: {
        //         xs: 8
        //       },
        //       ...getCommonSubHeader({
        //         labelName: "Summary",
        //         labelKey: "BK_OSB_HEADER_STEP_4"
        //       })
        //     },
        //     editSection: {
        //       componentPath: "Button",
        //       props: {
        //         color: "primary",
        //         style: {
        //           marginTop: "-10px",
        //           marginRight: "-18px"
        //         }
        //       },
        //       gridDefination: {
        //         xs: 4,
        //         align: "right"
        //       },
        //       children: {
        //         editIcon: {
        //           uiFramework: "custom-atoms",
        //           componentPath: "Icon",
        //           props: {
        //             iconName: "edit"
        //           }
        //         },
        //         buttonLabel: getLabel({
        //           labelName: "Edit",
        //           labelKey: "NOC_SUMMARY_EDIT"
        //         })
        //       },
        //       onClickDefination: {
        //         action: "condition",
        //         callBack: callBackForPrevious
        //       }
        //     }
        //   }
        // },
        applicationSearch: {
          // uiFramework: "custom-molecules-local",
          // moduleName: "egov-services",
          // componentPath: "ApplicationSearch",
          uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "apply_form1",
          },
          children: {
            searchDetails,
          },
        },
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "BK_OSB_APPLICATION_NUMBER",
                jsonPath: "bkApplicationNumber",
              },
              {
                label: "BK_OSB_APPLICATION_STATUS",
                jsonPath: "bkApplicationStatus",
              },
              {
                label: "BK_OSB_APPLICATION_TYPE",
                jsonPath: "bkBookingType",
              },
            ],
            moduleName: "Booking",
            homeURL: "/egov-services/applyservices",
          },
        },
      },
    },
  },
};

export default screenConfig;
