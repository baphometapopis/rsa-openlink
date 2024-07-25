import React, { useEffect, useState } from 'react';
import { IconSearch } from '../../Constant/imageConstant';
import { Api_Endpoints } from '../../Services/Api/apiEndpoint';
import { makeApiCall } from '../../Services/Api/makeApiCall';
import { showErrorToast, showSuccessToast } from '../../Services/ToastServices/toastService';
import { setFormDatatoLocal } from '../../Utils/localStorage';
import VerifyHuman from '../VerifyHuman/VerifyHuman';
import './HomePage.css';

const HomePage = () => {
  const [engineNumber, setEngineNumber] = useState('');
  const [Policydata, setPolicydata] = useState('');

  const [error, setError] = useState('');
  const [showVerificationBox,setshowVerificationBox]=useState(false)

  // Function to validate engine number
  const validateEngineNumber = (value) => {
    // Define the validation pattern (alphanumeric, no special characters, 1-17 characters)
    const pattern = /^[A-Za-z0-9]{5,17}$/;
    if (!pattern.test(value)) {
      setError('Invalid engine number. It should be 5-17 alphanumeric characters and no special characters.');
    } else {
      setError('');
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    // Limit the input to 17 characters
    if (value.length <= 17) {
      setEngineNumber(value);
      validateEngineNumber(value);
    }
  
  };
  
  const SearchEngineNumber=()=>{
    if(!engineNumber==''){
    getVehicleDetails()
    }else{
      showErrorToast('Please Enter Engine No')
    }
  }


const getVehicleDetails=async()=>{
  // BG4AG1838430
  const res = await makeApiCall(Api_Endpoints?.getDataByChassisNumber,'POST',{vehicle_detail:engineNumber,policy_type:'service'})
  if(res?.status){
    console.log(res)
    setPolicydata(res)
    setFormDatatoLocal(res)

    showSuccessToast('Engine Number Found')
    setshowVerificationBox(true)
  }else{
    showErrorToast(res?.message)
  }

}
  useEffect(()=>{},[showVerificationBox,Policydata])
  return (
    <div className='HomeContainer'>
      <div className='Searchcontainer'>
        <input
          type='text'
          value={engineNumber}
          onChange={handleInputChange}
          placeholder='Search Engine'
          className='searchBar'
          maxLength='17' // HTML attribute to limit input length
        />
        <div className='SearchIcon'>
          <img src={IconSearch} alt='Search Icon' onClick={SearchEngineNumber}  className='searchIcon' />
        </div>
      </div>
      {error && <p className='error'>{error}</p>} {/* Display validation error */}
      {showVerificationBox&&Policydata &&  <VerifyHuman modelID={'adasdasd'} params={Policydata}/>}

    </div>
  );
};

export default HomePage;
