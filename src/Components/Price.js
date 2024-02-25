
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase'; // Assuming you have the authentication instance
import './Styles.css';



export default function Pricing (){

  const [user, setUser] = useState(null);
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
  


  const Buypackage = async (e) => {
    e.preventDefault();
    
    if (!user  || !user.uid) {
      console.log("User not authenticated");
    
      return;
    }
 
    const adminsDocRef = doc(firestore, 'Admins', user.uid);
  
    try {
      // Check if the document exists
      const adminsDocSnapshot = await getDoc(adminsDocRef);
  
      if (adminsDocSnapshot.exists()) {
        // Document exists, update it
        await updateDoc(adminsDocRef, {
          packagename: "Gold package",
          Subscription_get: serverTimestamp(),
        });
  
        console.log("Package bought successfully!");
      } else {
        // Document doesn't exist, create it
        await setDoc(adminsDocRef, {
          packagename: "Gold package",
          Subscription_get: serverTimestamp(),
        });
  
        console.log("Package created and bought successfully!");
      }
    } catch (error) {
      console.error("Error buying package:", error);
    }
  };
  
return(
<div style={{marginTop:'90px'}}>
<main class="my-4">
  <div class="container">
    
    <section class="text-center">
      <h4 class="mb-4"><strong>Pricing</strong></h4>

      <div class="btn-group mb-4" role="group" aria-label="Basic example">
      
        <button type="button" class="btn btn-primary" data-mdb-ripple-init>
       Billing 
        </button>
      </div>

      <div class="row">

        
        <div class="col-lg-2 col-md-6 mb-4">

          
         
          

        </div>
    
        <div class="col-lg-3 col-md-6 mb-4">

          
          <div class="card border border-primary">

            <div class="card-header bg-white py-3">
              <p class="text-uppercase small mb-2" id="Silver Package"><strong>Silver Package</strong></p>
              <h5 class="mb-0">$45/Month</h5>
            </div>

            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">0-5000 Users</li>
                <li class="list-group-item">Post your Ads</li>
                <li class="list-group-item">Pie chart and bar chart</li>
              </ul>
            </div>

            <div class="card-footer bg-white py-3">
              <Link to="/Checkouts"><button type="button"
                // onClick={Buypackage} 
              class="btn btn-primary btn-sm" data-mdb-ripple-init>Buy now</button></Link>
            </div>

          </div>
       

        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">

         
          <div class="card">

            <div class="card-header bg-white py-3">
              <p class="text-uppercase small mb-2" id="Gold Package"><strong>Gold Package</strong></p>
              <h5 class="mb-0">$150/3 Month</h5>
            </div>

            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">0-50 000 Users</li>
                <li class="list-group-item">Report generate</li>
                <li class="list-group-item">Post your Ads</li>
                <li class="list-group-item">Pie chart and bar chart</li>
              
              </ul>
            </div>

            <div class="card-footer bg-white py-3">
              <button type="button"
              
              class="btn btn-info btn-sm" data-mdb-ripple-init>Buy now</button>
            </div>

          </div>
          

        </div>
       
        <div class="col-lg-3 col-md-6 mb-4">

      
          <div class="card">

            <div class="card-header bg-white py-3">
              <p class="text-uppercase small mb-2" id="Platinum Package"><strong>Platinum Package</strong></p>
              <h5 class="mb-0">$400/Annual</h5>
            </div>

            <div class="card-body">
              <ul class="list-group list-group-flush">
              <li class="list-group-item">Unlimited Users</li>
                <li class="list-group-item">Report generate</li>
                <li class="list-group-item">Post your Ads</li>
                <li class="list-group-item">Pie chart and bar chart</li>
              </ul>
            </div>

            <div class="card-footer bg-white py-3">
              <button type="button" class="btn btn-info btn-sm" data-mdb-ripple-init>Buy now</button>
            </div>

          </div>
       

        </div>
    

      </div>
    </section>
  
  </div>
</main>
    

</div>

    );
}
