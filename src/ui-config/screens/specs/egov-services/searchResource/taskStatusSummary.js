import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

export const taskStatusSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "NOC_REMARK",
          labelKey: "MY_BK_REMARKS_DETAILS_HEADER"
        })
      },
	  // editSection: {
    //     componentPath: "Button",
    //     props: {
		//   className: "pet_resend_btn",	
		//   variant: "contained",
    //       color: "primary",
        
    //     },
    //     gridDefination: {
    //       xs: 4,
    //       align: "right"
    //     },
    //     children: {
          
    //       buttonLabel: getLabel({
    //         labelName: "RESEND",
    //         labelKey: "NOC_SUMMARY_RESEND"
    //       })
    //     },
    //     onClickDefination: {
    //       action: "condition",
    //       callBack: (state, dispatch) => {
    //         let applicationType = getapplicationType(); 
			       
    //         gotoApplyWithStep(state, dispatch, 0);
    //       }
    //     }
    //   }

    }
  },
  body: getCommonContainer({
    Date: getLabelWithValue(
      
      {
        jsonPath: "Booking.bookingsRemarks[0]",
        callBack: value => {
          if(value===undefined)
          {
            return '';
          }
          else{
          let remark = value['bkRemarks'] === '' ? 'No Remarks Available.' :value['bkRemarks'];
          return remark;
          }
        }
      }
    ),

  })
});

