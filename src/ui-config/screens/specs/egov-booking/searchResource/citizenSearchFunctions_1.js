import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import { getGridData1 ,getGridDataSellMeat1,getGridDataRoadcut1,getGridDataAdvertisement1} from "../../../../../ui-utils/commons";
import { getGridData1,getCategory1,getSubCategory1,getUpdatePriceBook1,getMasterGridData1,getGridDataSellMeat1,getGridDataRoadcut1,getGridDataAdvertisement1} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";

export const fetchData = async (action, state, dispatch) => {
const response = await getSearchResults();
//const mdmsRes = await getMdmsData(dispatch);
// let tenants =
// mdmsRes &&
// mdmsRes.MdmsRes &&
// mdmsRes.MdmsRes.tenant.citymodule.find(item => {
// if (item.code === "TL") return true;
// });
// dispatch(
// prepareFinalObject(
// "applyScreenMdmsData.common-masters.citiesByModule.TL",
// tenants
// )
// );
try {

if (response.nocApplicationDetail.length > 0) {
dispatch(prepareFinalObject("searchResults", response.nocApplicationDetail));
dispatch(
prepareFinalObject("myApplicationsCount", response.nocApplicationDetail.length)
);
}
} catch (error) {
console.log(error);
}
};

export const getGridData = async (action, state, dispatch) => {
  const response = await getGridData1();
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
     // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));
      
      localStorage.setItem('data',JSON.stringify(response.nocApplicationDetail))
      
     dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};


export const getGridDataSellMeat = async (action, state, dispatch) => {
  const response = await getGridDataSellMeat1();
 
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      localStorage.setItem('dataSellMeat',JSON.stringify(response.nocApplicationDetail))
      //alert(localStorage.getItem('data')
    //)
      dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridDataRoadcut = async (action, state, dispatch) => {
  const response = await getGridDataRoadcut1();
 
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      localStorage.setItem('dataRoadcut',JSON.stringify(response.nocApplicationDetail))
      //alert(localStorage.getItem('data')
    //)
      dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};




export const getGridDataAdvertisement = async (action, state, dispatch) => {
  const response = await getGridDataAdvertisement1();
 
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      localStorage.setItem('dataAdvertisement',JSON.stringify(response.nocApplicationDetail))
      //alert(localStorage.getItem('data')
    //)
      dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      );
    }
   
  } catch (error) {
    console.log(error);
  }
};






























export const getMasterGridData = async (action, state, dispatch) => {
  const response = await getMasterGridData1();
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
     // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));
      
      localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
      
     dispatch(prepareFinalObject("Matserdata",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("MatserdataCount",response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUpdatePriceBook = async (action, state, dispatch,pricebookid) => {
  const response = await getUpdatePriceBook1(pricebookid);
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
     // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));
      
     // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
    let date= convertEpochToDate (response.nocApplicationDetail[0].effectiveFromDate)
     let data=response.nocApplicationDetail[0]
     
      date=date.split('/')
      date=date[2]+'-'+date[1]+'-'+date[0]
     // Matserdata[0].effectiveFromDate
    
   data['effectiveFromDate']=date
    //  alert(JSON.stringify(data))
     dispatch(prepareFinalObject("Matserdata",response.nocApplicationDetail ));

      dispatch(
        prepareFinalObject("MatserdataCount",response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
export const getCategory = async (action, state, dispatch,pricebookid) => {
  const response = await getCategory1();
  try {
    if (response) {
     // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));
      
     // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
      
     dispatch(prepareFinalObject("category",response.MdmsRes.egpm.typeOfAdvertisement ));

      dispatch(
        prepareFinalObject("categorycount",response.MdmsRes.egpm.typeOfAdvertisement.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
export const getSubCategory = async (action, state, dispatch,pricebookid) => {
  const response = await getSubCategory1();
  try {
    if (response) {
     // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));
      
     // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
      
     dispatch(prepareFinalObject("subcategory",response.MdmsRes.egpm.subTypeOfAdvertisement ));

      dispatch(
        prepareFinalObject("subcategorycount",response.MdmsRes.egpm.subTypeOfAdvertisement.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};