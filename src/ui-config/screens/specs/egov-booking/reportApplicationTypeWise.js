import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import {NOCReport2} from "./searchResource/MISSummaryReportApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { pendingApprovals } from "./searchResource/pendingApprovals";
  import { searchResultsReports2 } from "./searchResource/searchResults";
  import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
  import {
    getOPMSTenantId,
    localStorageGet
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
  import { getUpdatePriceBook ,getSubCategory,getSectordata} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Revenue Collection Report Application Type Wise",
    labelKey: "NOC_REVENUE_COLLECTION_REPORT_APPLICATION_TYPE_WISE"
  });
  
  const pageResetAndChange = (state, dispatch) => {
    dispatch(
      prepareFinalObject("FireNOCs", [{ "fireNOCDetails.fireNOCType": "NEW" }])
    );
    // dispatch(setRoute("/tradelicence/apply"));al
  };
  //alert('in update rate')
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "reportApplicationTypeWise",
    beforeInitScreen: (action, state, dispatch) => {
        
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );

  
    getSectordata(action, state, dispatch);
    set(
      state,
      "screenConfiguration.preparedFinalObject.RevenueByApplicationTypeReport[0].ToDate",
      new Date()
    );
    set(
      state,
      "screenConfiguration.preparedFinalObject.RevenueByApplicationTypeReport[0].FromDate",
      new Date()
    );
      const tenantId = getOPMSTenantId();
      // const BSqueryObject = [
      //   { key: "tenantId", value: tenantId },
      //   { key: "businessServices", value: "FIRENOC" }
      // ];
      // setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
      // const businessServiceData = JSON.parse(
      //   localStorageGet("businessServiceData")
      // );
      // const data = find(businessServiceData, { businessService: "FIRENOC" });
      // const { states } = data || [];
      // if (states && states.length > 0) {
      //   const status = states.map((item, index) => {
      //     return {
      //       code: item.state
      //     };
      //   });
      //   dispatch(
      //     prepareFinalObject(
      //       "applyScreenMdmsData.searchScreen.status",
      //       status.filter(item => item.code != null)
      //     )
      //   );
      // }
      // getRequiredDocData(action, state, dispatch).then(() => {
      //   let documents = get(
      //     state,
      //     "screenConfiguration.preparedFinalObject.searchScreenMdmsData.FireNoc.Documents",
      //     []
      //   );
      //   set(
      //     action,
      //     "screenConfig.components.adhocDialog.children.popup",
      //     getRequiredDocuments(documents)
      //   );
      // });
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "reportApplicationTypeWise"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                ...header
              },
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right"
                },
                visible: enableButton,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px"
                  }
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px"
                      }
                    }
                  },
  
                  buttonLabel: getLabel({
                    labelName: "NEW APPLICATION",
                    labelKey: "NOC_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch) => {
                    pageResetAndChange(state, dispatch);
                    showHideAdhocPopup(state, dispatch, "reportApplicationTypeWise");
                  }
                },
                roleDefination: {
                  rolePath: "user-info.roles",
                  roles: ["NOC_CEMP", "SUPERUSER"]
                }
              }
            }
          },
          NOCReport2,

          breakAfterSearch: getBreak(),
       //   NOCApplication2,
          
          // progressStatus,
          searchResultsReports2
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-noc",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "reportApplicationTypeWise"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default NOCSearchAndResult;
  