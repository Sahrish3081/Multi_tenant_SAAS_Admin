import Header from "../assets/components/Header";
// import Signup from "../assets/components/Signup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faShieldHalved } from '@fortawesome/free-solid-svg-icons';


export default function Index(){
    return(
        <>
        <Header/>
       <div className="flex  text-center justify-center ">
          <div className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
       <p>  <FontAwesomeIcon icon={faShieldHalved} size="lg" />Secure , Scalable , Built for Teams.</p>
        </div>
       </div>
        
        </>
            
           
      
    )
}