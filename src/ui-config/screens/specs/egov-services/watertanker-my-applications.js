import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader, getLabel, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType, getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { searchDetails } from "./searchResource/searchForm";
import { httpRequest } from "../../../../ui-utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "MY_BK_APPLICATIONS_HEADER",
  },
  {
    classes: {
      root: "common-header-cont",
    },
  }
);

const getMdmsData = async (action, state, dispatch) => {
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
    console.log(payload.MdmsRes, "mdmsRes");
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType("MyBooking");
    getMdmsData(action, state, dispatch);
    // .then((response) => {
      // prepareDocumentsUploadData(state, dispatch, "apply_osb");
        fetchData(action, state, dispatch);
    // });
    return action;
  },
  components: {
    header,
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        applicationSearch: {
          uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "apply_form1",
            style: {
              marginLeft: 8,
              marginRight: 8,
            }
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
  },
};

export default screenConfig;
