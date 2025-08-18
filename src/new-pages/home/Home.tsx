import React, {FC} from "react";
import "./Home.css"
import MobileMenu from "../mobile-menu/SystemMenu";

const Home: FC = () => {

    return (<React.Fragment>
        <div className="home-layout">
            <div className="web-layout">

            </div>
            <div className="mobile-layout">
                <MobileMenu/>
            </div>

        </div>


    </React.Fragment>)
}

export default Home;
