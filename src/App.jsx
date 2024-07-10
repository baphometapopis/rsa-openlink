import './App.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import TextInput from './Components/UI/TextInput'
import moment from 'moment'
import Dropdown from './Components/UI/Dropdown'
import ToggleSwitch from './Components/UI/ToggleSwitch'
import DatePicker from './Components/UI/DatePicker'
import { useEffect } from 'react'
import {makeApiCall} from './Services/Api/makeApiCall'
import {Api_Endpoints} from './Services/Api/apiEndpoint'
import {showSuccessToast,showErrorToast} from './Services/ToastServices/toastService'
import VerifyHuman from './Pages/VerifyHuman/VerifyHuman'
import {getUserSession, setFormDatatoLocal, setUserSession} from './Utils/localStorage'
import useIsMainWindow from './Utils/useIsMainWindow'
import PaymentModal from './Pages/Modal/PaymentModal'
import { convertDateFormat } from './Utils/ConvertDateFormat'
import ErrorModal from './Pages/Modal/ErrorModal'

function App() {
  const params = useParams()
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const [selectedVehicleOption, setselectedVehicleOption] = useState()
  const [salutation, setsalutation] = useState([])
  const [genderOption, setgenderOption] = useState([])
  const [selectedPlan,setSelectedPlan]=useState('')
  
  const [nom_relation, setnom_relation] = useState([])
  const [modalArr, setmodalArr] = useState([])
  const [isBHSeries,setisBHSeries]= useState(false)
  const [isAppointee,setisAppointee]= useState(false)
  const [showVerificationBox,setshowVerificationBox]=useState(false)
  const [formData, setFormData] = useState({
    state:'',
    city:'',
    engine_no: '',
    chassis_no: '',
    vehicle_type: '',
    manufacturer: '',
    registration_no: '',
    model_id: '',
    reg_series:'',
    salutation: '',
    first_name: '',
    middel_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    gender: '',
    dob: '',
    cust_addr1: '',
    cust_addr2: '',
    pin: '',
    city_id: '',
    state_id: '',
    nominee_full_name: '',
    nominee_age: '',
    nominee_relation: '',
    appointee_full_name: '',
    appointee_age: '',
    appointee_relation: ''
  })
  
  const [formErrors, setformErrors] = useState({})

  const [isModalVisible, setIsModalVisible] = useState(false);

const [paymentData,setPaymentData]=useState('')
const showError = (error) => {
  setError(error);
  setIsErrorModalVisible(true);
};

const handleErrorModalClose = () => {
  setIsErrorModalVisible(false);
  setError(null);
};

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  const option = [{ value: '1212', label: '21212' }]
  const handleDateChange = (e) => {
    const updatedErrors = { ...formErrors }

    setFormData({
      ...formData,
      dob: e.target.value
    });

  
    // Delete errors for specific fields
    delete updatedErrors['dob'];
    setformErrors(updatedErrors)
  };


const toggleFlip=()=>{
setisBHSeries(!isBHSeries)

}

  const handleChange = (e, name) => {
    // Clear validation error for the field when typing starts
    let textinput=''
    const updatedErrors = { ...formErrors }
    delete updatedErrors[name]
    setformErrors(updatedErrors)

    // Handle specific validations based on field name
    switch (name) {
      case 'engine_no':
        // Allow only capital letters and limit to 17 characters
        textinput = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
        setFormData({
          ...formData,
          [name]: textinput
        })
        if (!/^[A-Z]{12,17}$/.test(textinput)) {
          updatedErrors[name] = 'Engine Number must be 12 - 17 capital letters'
        }
        break
        case 'first_name':
        case 'middel_name':
        case 'last_name':
        case 'nominee_full_name':
        case 'appointee_full_name':
          // Allow only capital letters and limit to 17 characters
          textinput = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').replace(/\s/g, '').slice(0, 35);
          setFormData({
            ...formData,
            [name]: textinput
          })
       
          break
          case 'cust_addr1':
          case 'cust_addr2':

            // Allow only capital letters and limit to 17 characters
             textinput = e.target.value.toUpperCase().slice(0, 35)
            setFormData({
              ...formData,
              [name]: textinput
            })
         
            break

           

            break
            case 'nominee_age':
              let ageInput = e.target.value.replace(/\D/g, '').slice(0, 3);
              const age = parseInt(ageInput);
              const showAppointee = age < 18;
            
              setFormData({
                ...formData,
                [name]: ageInput
              });
              setisAppointee(showAppointee);
            
              break;
            
              case 'appointee_age':
                // Allow only digits and limit to 3 characters
                textinput = e.target.value.replace(/\D/g, '').slice(0, 3);
                setFormData({
                  ...formData,
                  [name]: textinput
                });
              
                // Validate that the age is not less than 18
                if (parseInt(textinput, 10) < 18) {
                  updatedErrors[name] = 'Appointee age must be at least 18';
                } else {
                  delete updatedErrors[name]; // Remove error if age is valid
                }
                break;
              
      case 'chassis_no':
        // Allow only digits and limit to exactly 17 characters
        let chassisNo = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
        setFormData({
          ...formData,
          [name]: chassisNo
        })
        if (chassisNo.length !== 17) {
          updatedErrors[name] = 'Chassis Number must be exactly 17 digits'
        }
        break
       case 'email':
  // Allow all characters except spaces and limit to 17 characters
  textinput = e.target.value.replace(/\s/g, '').slice(0, 50);
  setFormData({
    ...formData,
    [name]: textinput
  });

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(textinput)) {
    updatedErrors[name] = 'Invalid email address';
  } else {
    delete updatedErrors[name]; // Remove error if email is valid
  }
  break;

        case 'registration_no':
          // Limit to maximum 10 characters
          let regNo = e.target.value.toUpperCase().replace(/\s/g, '').slice(0, 10);
          regNo = regNo.replace(/[^A-Z0-9]/g, '');

          // Define regex patterns for validation
          const standardSeriesRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
          const bhSeriesRegex = /^[0-9]{2}BH[0-9]{4}[A-Z]{2}$/;
        
          // Determine series type based on the first character
          const firstChar = regNo.charAt(0);
          const isBHSeries = !isNaN(firstChar);

          setisBHSeries(isBHSeries)
        
          // Check if the entered registration number matches the series type
          if (!isBHSeries && !standardSeriesRegex.test(regNo)) {
            updatedErrors[name] = 'Invalid Normal Series Vehicle Registration Number';
          }
        
          if (isBHSeries && !bhSeriesRegex.test(regNo)) {
            updatedErrors[name] = 'Invalid BH Series Vehicle Registration Number';
          }
        
          setFormData({
            ...formData,
            [name]: regNo
          });
        
          break;
        
      case 'pin':
        // Allow only digits and limit to 6 characters

        const pincode = e.target.value.replace(/\D/g, '').slice(0, 6)
        setFormData({
          ...formData,
          [name]: pincode
        })

        if (pincode.length !== 6) {
          updatedErrors[name] = 'Pincode must be exactly 6 digits'
        }
        if(pincode.length===6){
          setFormData({
            ...formData,
            state_id:'',
            state:'',
            city:'',
            city_id:'',
            pin:''
          });

          fetchPincode(pincode)}
        
        break
        case 'mobile_no':
          // Allow only digits and limit to 10 characters
          const mobileNo = e.target.value.replace(/\D/g, '').slice(0, 10);
          setFormData({
            ...formData,
            [name]: mobileNo
          });
        
          // Validate Indian mobile number
          const mobilePattern = /^[6-9]\d{9}$/;
          if (!mobilePattern.test(mobileNo)) {
            updatedErrors[name] = 'Mobile Number must be exactly 10 digits and start with 6, 7, 8, or 9';
          } else {
            delete updatedErrors[name]; // Remove error if mobile number is valid
          }
          break;
        
      // Add more cases for other fields as needed
      default:
        setFormData({
          ...formData,
          [name]: e.target.value
        })
    }

    setformErrors(updatedErrors)
  }

  const handleDropdownChange = (selectedOption, name) => {
    const updatedErrors = { ...formErrors }
    delete updatedErrors[name]
    setformErrors(updatedErrors)

    setFormData({
      ...formData,
      [name]: selectedOption.target.value
    })
  }

  const validateForm = () => {
    const errors = {};
  
    // Required fields
    const requiredFields = [
      'engine_no', 'chassis_no', 'vehicle_type', 'manufacturer',
      'registration_no', 'model_id', 'salutation', 'first_name', 'last_name', 'email',
      'mobile_no', 'gender', 'dob', 'cust_addr1', 'cust_addr2', 'pin', 'city',
      'state', 'nominee_full_name', 'nominee_age', 'nominee_relation'
    ];
  
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
  
    // Check if nominee_age is less than 18, then appointee fields are required
    if (parseInt(formData.nominee_age) < 18) {
      const appointeeRequiredFields = ['appointee_full_name', 'appointee_age', 'appointee_relation'];
      appointeeRequiredFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = 'This field is required';
        }
      });
    }
  
    setformErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (validateForm()) {
      // Add your handleSubmit logic here
      if(selectedPlan){
const res = await makeApiCall(Api_Endpoints?.BuyPolicy,'POST',{plan:selectedPlan?.id,dealer_code:params?.dealer_id,policy_type:params?.service,...formData})
        if(res?.status){
          const paymentData = JSON.parse(res?.data);
          // console.log(paymentData)

          handleOpenModal()
          setPaymentData(paymentData)
          showSuccessToast(res?.message)
        }else{
          showErrorToast(res?.message)
        }
      }else{
      setFormDatatoLocal(formData)
      setshowVerificationBox(true)
      // navigate('Verify-Human')
      }
      
    }


  }
  const getVehicleDetails = async()=>{
    const res = await makeApiCall(Api_Endpoints?.getDataByChassisNumber,'POST',{vehicle_detail:params?.engine_no,policy_type:params?.service})
    if(res?.status){
      showSuccessToast(res?.message)
      let VehicleData = res?.policy_data
      const registrationNumber = VehicleData?.registration_no??'';
const formattedRegistrationNumber = registrationNumber.replace(/-/g, "");
      setFormData({
        ...formData,
        state:VehicleData?.state,
        city:VehicleData?.city,
        engine_no: VehicleData?.engine_no,
        chassis_no: VehicleData?.chassis_no,
        vehicle_type: VehicleData?.vehicle_type,
        manufacturer: VehicleData?.manufacturer,
        registration_no: formattedRegistrationNumber,
        model_id: VehicleData?.model_id,
        reg_series:VehicleData?.reg_series,
        salutation: VehicleData?.salutation,
        first_name: VehicleData?.first_name,
        middel_name: VehicleData?.middel_name,
        last_name: VehicleData?.last_name,
        email: VehicleData?.email,
        mobile_no: VehicleData?.mobile_no,
        gender: VehicleData?.gender,
        dob: convertDateFormat(VehicleData?.dob),
        cust_addr1: VehicleData?.cust_addr1,
        cust_addr2: VehicleData?.cust_addr2,
        pin: VehicleData?.pin,
        city_id: VehicleData?.city_id,
        state_id: VehicleData?.state_id,
        nominee_full_name: VehicleData?.nominee_full_name,
        nominee_age: VehicleData?.nominee_age,
        nominee_relation: VehicleData?.nominee_relation,
        appointee_full_name: VehicleData?.appointee_full_name,
        appointee_age: VehicleData?.appointee_age,
        appointee_relation: VehicleData?.appointee_relation
      });

    }else{
      showError(res?.message)
      showErrorToast(res?.message)
    }
  }
  const fetchPincode =async(pincode)=>{
    const res = await makeApiCall(Api_Endpoints?.GetPincodeData,'GET',{pincode:pincode})
    if(res?.status){
      showSuccessToast('Pincode Found')
      setFormData({
        ...formData,
        state_id:res?.pincode_data?.state_id,
        state:res?.pincode_data?.state_name,
        city:res?.pincode_data?.city_or_village_name,
        city_id:res?.pincode_data?.city_id,
        pin:pincode
      });
      const updatedErrors = { ...formErrors };
  
      // Delete errors for specific fields
      delete updatedErrors['state_id'];
      delete updatedErrors['state'];
      delete updatedErrors['city'];
      delete updatedErrors['city_id'];
      delete updatedErrors['pin'];
      
      setformErrors(updatedErrors);

    }else{
      showErrorToast(res?.message)
    }


  }

  const getDropDownData =async()=>{
    const res = await makeApiCall(Api_Endpoints?.getDropDownData,'POST',{policy_type:params?.service})
    if(res?.status){
      setmodalArr(res?.model_array);
      setsalutation(res?.salutation_master)
      setgenderOption(res?.genders_master)
      setnom_relation(res?.nominee_realtion)
    }else{
      showErrorToast(res?.message)
    }

    
  }


  useEffect(()=>{
    const data = getUserSession()


    console.log(data)


    if(params?.engine_no)
    {

      getVehicleDetails()
      getDropDownData()
    }

    if(data?.formData?.engine_no===params?.engine_no){
      setFormData(data?.formData)
    }else{
      setUserSession(params)
    }

    if(data?.formData?.selectedPlan){
      setSelectedPlan(data?.formData?.selectedPlan)
    }
  },[])


  
 
  return (
    <div className='MainContainer'>
     
      <div className='FormContainer'>
        <div className='FormHeader'>
          <p style={{ fontSize: '24px' }}>
            Road Side Assistance (RSA)
          </p>
        </div>
        <form onSubmit={handleSubmit}>

        <h4 style={{color:'#183882',fontSize:'22px',margin:'25px'}}>Vehicle Details</h4>

          <div className='internalFormContainer'>
            
            <TextInput
              required={true}
              id="engine_no"
              name="engine_no"
              placeholder="Enter your Engine Number"
              label="Engine Number"
              onChange={(e) => handleChange(e, 'engine_no')}
              value={formData.engine_no}
              error={formErrors.engine_no}
            />
            <TextInput
              required={true}
              id="chassis_no"
              name="chassis_no"
              placeholder="Enter your Chassis Number"
              label="Chassis Number"
              value={formData.chassis_no}
              onChange={(e) => handleChange(e, 'chassis_no')}
              error={formErrors.chassis_no}
            />
            <TextInput
              required={true}
              id="vehicle_type"
              name="vehicle_type"
              placeholder="Enter your Vehicle Type NEW OR OLD"
              label="Vehicle Type"
              value={formData.vehicle_type}
              onChange={(e) => handleChange(e, 'vehicle_type')}
              error={formErrors.vehicle_type}
            />
            <TextInput
              required={true}
              id="manufacturer"
              name="manufacturer"
              placeholder="Enter your Manufacturer"
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => handleChange(e, 'manufacturer')}
              error={formErrors.manufacturer}
            />
            <Dropdown
              required={true}
              label="Model"
              value={formData.model_id}
              onChange={(selectedOption) => handleDropdownChange(selectedOption, 'model_id')}
              options={modalArr.map(data => ({
                value: data.model_name_id,
                label: data.model_name
              }))}
              placeholder="Select Model"
              error={formErrors.model_id}
            />
<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<ToggleSwitch  isChecked={isBHSeries} label='Registration Type'/>
</div>


            <TextInput
              required={true}
              id="registration_no"
              name="registration_no"
              label='Vehicle Registration No'
              maxLength={10}
              placeholder={`EX..${isBHSeries?'22AQ1111OO':'MH01AB1234'}`}

              value={formData.registration_no}
              onChange={(e) => handleChange(e, 'registration_no')}
              error={formErrors.registration_no}
            />
            <div></div>
            <div></div>
          </div>

          <h4 style={{color:'#183882',fontSize:'22px',margin:'25px'}}>Customer Details</h4>
          <div className='internalFormContainer'>
            <Dropdown
              required={true}
              label="Salutation"
              value={formData.salutation}
              onChange={(selectedOption) => handleDropdownChange(selectedOption, 'salutation')}
              options={salutation.map(data => ({
                value: data.id,
                label: data.label
              }))}
              placeholder="Select Salutation"
              error={formErrors.salutation}
            />
            <TextInput
              required={true}
              id="first_name"
              name="first_name"
              placeholder="Enter your First Name"
              label="First Name"
              value={formData.first_name}
              onChange={(e) => handleChange(e, 'first_name')}
              error={formErrors.first_name}
            />
            <TextInput
              id="middel_name"
              name="middel_name"
              placeholder="Enter your Middle Name"
              label="Middle Name"
              value={formData.middel_name}
              onChange={(e) => handleChange(e, 'middel_name')}
              error={formErrors.middel_name}
            />
            <TextInput
              id="last_name"
              required={true}
              name="last_name"
              placeholder="Enter your Last Name"
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleChange(e, 'last_name')}
              error={formErrors.last_name}
            />
            <TextInput
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              error={formErrors.email}
            />
            <TextInput
              id="mobile_no"
              name="mobile_no"
              placeholder="Enter your Mobile No"
              label="Mobile No"
              required={true}
              value={formData.mobile_no}
              onChange={(e) => handleChange(e, 'mobile_no')}
              error={formErrors.mobile_no}
            />
            <Dropdown
              required={true}
              label="Gender"
              value={formData.gender}
              onChange={(selectedOption) => handleDropdownChange(selectedOption, 'gender')}
              options={genderOption.map(data => ({
                value: data.id,
                label: data.label
              }))}
              placeholder="Select Gender"
              error={formErrors.gender}
            />
              <DatePicker
        label="Date of Birth"
        required
        value={formData.dob}
        onChange={handleDateChange}
        error={formErrors.dob}
        inputClassName="custom-date-input"
        isDisabled={false}
      />
           
            <TextInput
              id="cust_addr1"
              name="cust_addr1"
              required={true}
              placeholder="Address 1"
              label="Address 1"
              value={formData.cust_addr1}
              onChange={(e) => handleChange(e, 'cust_addr1')}
              error={formErrors.cust_addr1}
              capitalize
            />
            <TextInput
              id="cust_addr2"
              name="cust_addr2"
              required={true}
              placeholder="Address 2"
              label="Address 2"
              value={formData.cust_addr2}
              onChange={(e) => handleChange(e, 'cust_addr2')}
              error={formErrors.cust_addr2}
              capitalize
            />
            <TextInput
              id="pin"
              name="pin"
              placeholder="Pincode"
              label="Pincode"
              required={true}
              value={formData.pin}
              onChange={(e) => handleChange(e, 'pin')}
              error={formErrors.pin}
              maxLength={6}
              numericOnly
            />
            <TextInput
              id="city_id"
              name="city_id"
              placeholder="City"
              label="City"
              disabled={true}
              required={true}
              value={formData?.city}
              error={formErrors.city_id}
            />
            <TextInput
              id="state_id"
              name="state_id"
              placeholder="State"
              label="State"
              disabled={true}
              required={true}
              value={formData?.state}
              error={formErrors.state_id}
            />
            <TextInput
              id="nominee_full_name"
              name="nominee_full_name"
              required={true}
              placeholder="Enter Nominee Name"
              label="Nominee Full Name"
              sentences
              value={formData.nominee_full_name}
              onChange={(e) => handleChange(e, 'nominee_full_name')}
              error={formErrors.nominee_full_name}
              capitalize
            />
            <TextInput
              id="nominee_age"
              name="nominee_age"
              placeholder="Nominee Age"
              label="Nominee Age"
              required={true}
              value={formData.nominee_age}
              onChange={(e) => handleChange(e, 'nominee_age')}
              error={formErrors.nominee_age}
              maxLength={2}
              numericOnly
            />
            <Dropdown
              required={true}
              label="Nominee Relationship"
              value={formData.nominee_relation}
              onChange={(selectedOption) => handleDropdownChange(selectedOption, 'nominee_relation')}
              options={nom_relation.map(data => ({
                value: data.id,
                label: data.show_label
              }))}
              placeholder="Select Nominee Relationship"
              error={formErrors.nominee_relation}
            />
            {isAppointee && 
              <>
            <TextInput
              id="appointee_full_name"
              name="appointee_full_name"
              required={true}
              placeholder="Enter Appointee Name"
              label="Appointee Full Name"
              sentences
              value={formData.appointee_full_name}
              onChange={(e) => handleChange(e, 'appointee_full_name')}
              error={formErrors.appointee_full_name}
              capitalize
            />
            <TextInput
              id="appointee_age"
              name="appointee_age"
              placeholder="Appointee Age"
              label="Appointee Age"
              required={true}
              value={formData.appointee_age}
              onChange={(e) => handleChange(e, 'appointee_age')}
              error={formErrors.appointee_age}
              numericOnly
              maxLength={2}
            />
            <Dropdown
              required={true}
              label="Appointee Relationship"
              value={formData.appointee_relation}
              onChange={(selectedOption) => handleDropdownChange(selectedOption, 'appointee_relation')}
              options={nom_relation.map(data => ({
                value: data.id,
                label: data.show_label
              }))}
              placeholder="Select Appointee Relationship"
              error={formErrors.appointee_relation}
            />
            </>}
            <div></div>
          </div>
    {showVerificationBox &&  <VerifyHuman modelID={formData?.model_id} params={params}/>}

         {!showVerificationBox&& <div className="form-actions">
            <button type="submit" className="submit-button">{selectedPlan?'Generate Policy':'Submit'}</button>
          </div>}

        </form>
      </div>
       
      {selectedPlan&&<div className="plans-container" style={{overflow:'hidden'}}>
        
        <div key={selectedPlan.id} className="plan-item" style={{justifyContent:'center',alignItems:'center'}}>
          <div className="plan-info">
            <h3 style={{color:'#a6a9ae',fontWeight:'700',width:'250px',textAlign:'center',margin:'15px'}}>
              {selectedPlan.plan_name}
            </h3>
            <p style={{color:'#0089D2',fontSize:'24px',fontWeight:'bold',textAlign:'center',width:'250px',margin:'15px'}}>
              ₹ {selectedPlan.plan_amount + selectedPlan.gst_amount}/<span style={{fontSize:'16px',fontWeight:'bold'}}>year</span>
            </p>
          </div>
        </div>
    </div>}
    <PaymentModal 
    // visible={isModalVisible} 
    visible={true} 
    
    data={paymentData} />
    <ErrorModal
        visible={isErrorModalVisible}
        onClose={handleErrorModalClose}
        error={error}
      />
    </div>
  )
}

export default App
