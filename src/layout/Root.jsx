

import { Outlet, useLocation} from 'react-router-dom';
import Navbar from '../components/Navbar';


const Root = () => {

    const location = useLocation()
    const hideNavbar = location.pathname ==="/login" || location.pathname === "/register"
    return (
        <div>
            { !hideNavbar &&  <Navbar/>}
            <Outlet/>
        </div>
    );
};

export default Root;