import React,{useEffect, useState} from 'react'
import Form from '../components/Form'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Pdf from '../components/Pdf.jsx';


const New = () => {

  const [data,setData] = useState([]);
  const [loading,setLoading]=useState(false);
  // useEffect(()=>{
  //   setLoading(true)
  //    const data = axios.get("https://jsonplaceholder.typicode.com/todos/1")
  //     .then((response)=>{
  //       console.log(response)
  //       setData(response.data)
  //       setLoading(false)
  //     })
      
  // },[])
  // console.log(data.title);



  const emptyFormState = {
    from:{ email:"", name:"",phNo:"", address:"", city:"", state:"", zipcode:"", country:"", gstId:"", logo:"" },
    to:{ email:"", name:"",phNo:"", address:"", city:"", state:"", zipcode:"", country:"", gstId:"", logo:"" },
    invoicing:{ currency:"", items:[],subTotal:"",total:"", note:"", additional:{ discount:"", taxes:"" } },
    paymentDetails:{ bankName:"", accountName:"", accountNumber:"", ifscCode:"" },
    invoiceTerms:{  issueDate:"", dueDate:"" }
  };
  ////////////////??Delete
  const testFormState={
     from:{ email:"atharv@gmail.com", name:"Atharv",phNo:"9876456272", address:"merces", city:"Panjim", state:"Goa", zipcode:"560037", country:"India", gstId:"GSTIN123", logo:"" },
    to:{ email:"bhargavi@gmail.com", name:"Bhargavi",phNo:"98214256272", address:"panjim", city:"Panjim", state:"Goa", zipcode:"403005", country:"India", gstId:"GSTIN1234", logo:"" },
    invoicing:{ currency:"INR",items:[
{description: 'sadd', quantity: 1, price: 13}],subTotal:"",total:"", note:"Invoice for perfume", additional:{ discount:"", taxes:"" } },
    paymentDetails:{ bankName:"HDFC", accountName:"Atharv", accountNumber:"12345778", ifscCode:"HDFC0009129" },
    invoiceTerms:{ issueDate:"", dueDate:"" }
  }
  const location=useLocation();
  const savedData = JSON.parse(localStorage.getItem("invoiceData"));
  const [formData,setFormData]=useState(savedData || emptyFormState)
  /////
  // const [formData,setFormData]=useState(testFormState)

  
  useEffect(()=>{
    if(location.state?.reset){
      localStorage.removeItem("invoiceData")
      setFormData(emptyFormState)
      setStep(1)
      setResetIndex((preve)=>preve+1)
    } else if(location.state?.editMode && location.state?.invoiceData){
      setFormData(location.state.invoiceData)
      localStorage.removeItem("invoiceData")
      setResetIndex((preve)=>preve+1)
    }
  },[location])
  useEffect(()=>{
    const timer = setTimeout(()=>{
      localStorage.setItem("invoiceData",JSON.stringify(formData))
    },2000);
    return ()=>clearTimeout(timer);
  },[formData])
  
  
  
  const [step,setStep] = useState(1)
  const [resetIndex,setResetIndex]=useState(0);
  useEffect(() => {
    if (savedData) {
      setResetIndex((i) => i + 1);
    }
  }, []);
  // useEffect(()=>{
  //   if(initialStep===1){
  //   setFormData(emptyFormState) 
  // }
  // },[initialStep])

  return (
    <div className=' flex flex-col lg:flex-row justify-center gap-7 '>
      <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl flex-1
       min-h-[60vh] lg:flex-1 lg:min-h-[90vh]'>
        <Form key={resetIndex} step={step} setStep={setStep} formData={formData} setFormData={setFormData}/>
        </div>
     <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl flex-2 min-h-[40vh] lg:flex-2 text-white space-y-3'>
  

  <Pdf data={formData}></Pdf>



</div>

    </div>
  )
}

export default New