import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./dashboard/dashboard";
import Login from "./LoginScreen/Login";
import "./App.css";
import ComponentList from "./Products/ComponentList/ComponentList";
import ComponentsData from "./Products/Component/ComponentsData";
import PricingScreen from "./Pricing/PricingScreen";

import Thankyou from "./Thankyoupage/Thankyou";
import ReferenceList from "./Pricing/ProjectReference/ReferenceList";
import AuditingTable from "./AuditingTable/AuditingTable";
import CompanyDetails from "./Companies/CompanyDetails";
import ContactDetails from "./Contacts/ContactDetails";
import ContactTable from "./Contacts/ContactTable";
import Callback from "./Activities/CallBack";

import Margin from "./Products/Margin/Margin";
import DashBoardScreen from "./dashboard/DashBoardScreen";
import AllDeals from "./Deals/AllDeals/AllDeals";
import UsersTab from "./UsersData/UsersTab";

import Compliance from "./Pricing/PricingStepper/Certificates/Compliance";
import DealDetails from "./Deals/DealDetails/DealDetails";
// import Partners from "./GEM/Partners";
import PartnerList from "./Partner/PartnerList";

import LoadingGIF from "./Image/Loader.gif";

import GemView from "./GEM/GemView";
import GEMList from "./GEM/GEMList";
import CustomersTab from "./Companies/CustomersTab";
import PartnerDetailsDrawer from './Partner/PartnerDetailsDrawer'; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storedUserData: null,
      logined: false,
      loading: false,
    };
  }

  componentDidMount() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    this.setState({ storedUserData });

    // Check if service workers are supported and messaging is initialized
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          // Proceed with Firebase messaging token requests here
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.warn('Service workers are not supported in this browser.');
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // Check if the 'logined' state has changed
    if (prevState.logined !== this.state.logined) {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      this.setState({ storedUserData });
      
    }
  }
  setLogined = (logined) => {
    this.setState({ logined });
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  render() {
    const { storedUserData, loading } = this.state;

    return (
      <Router>
        <GoogleOAuthProvider clientId="558462773191-hhl6ts0fh26k6a1e137a9r456nhneckk.apps.googleusercontent.com">
          {loading && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1301, // High z-index to make sure it's above everything
              }}
            >
              <img src={LoadingGIF} alt="Loading..." style={{ width: '580px', height: '450px' }} />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Login setLogined={this.setLogined} />} />
            <Route path="/login" element={<Login setLogined={this.setLogined} />} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/oauth2/callback" component={Callback} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route
                index
                path={"/dashboard/users"}
                element={
                  storedUserData && storedUserData.team === "Admin" ? (
                    <UsersTab />
                  ) : (
                    <p>No found</p>
                  )
                }
              />
              <Route index path={"/dashboard/screen"} element={<DashBoardScreen />} />
              <Route
                index
                path="/dashboard/deals"
                element={<AllDeals setLoading={this.setLoading} />}
              />

              <Route index path="/dashboard/deal_details" element={<DealDetails />} />
              <Route
                index
                path="/dashboard/pricing"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Pricing") && <PricingScreen />
                }
              />
              <Route
                index
                path="/dashboard/compliance"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Compliance") && <Compliance />
                }
              />
              <Route
                index
                path="/dashboard/product-components"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Pricing") && <ComponentsData />
                }
              />
              <Route
                index
                path="/dashboard/product-componentsList"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Pricing") && <ComponentList />
                }
              />
              <Route
                index
                path="/dashboard/product-margin"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    (storedUserData.team === "Pricing" &&
                      storedUserData.userRole === "Senior Executive") ||
                    (storedUserData.team === "Pricing" &&
                      storedUserData.userRole === "Manager")) && <Margin />
                }
              />
              <Route
                index
                path="/dashboard/pricing_reference"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Pricing") && <ReferenceList />
                }
              />
              <Route
                index
                path="/dashboard/customers_table"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Marketing") && <CustomersTab />
                }
              />
              <Route
                index
                path="/dashboard/contact_table"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Marketing") && <ContactTable />
                }
              />
              <Route
                index
                path="/dashboard/company_details"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Marketing") && <CompanyDetails setLoading={this.setLoading} />
                }
              />
              <Route
                index
                path="/dashboard/contact_details"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Marketing") && <ContactDetails  setLoading={this.setLoading}/>
                }
              />
                <Route
                index
                path="/dashboard/partner_details"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Marketing") && <PartnerDetailsDrawer />
                }
              />
              <Route
                index
                path="/dashboard/partners"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Pricing" ||
                    storedUserData.team === "Marketing") && <PartnerList />
                }
              />
              <Route
                index
                path="/dashboard/gem"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Pricing" ||
                    storedUserData.team === "Marketing") && <GEMList />
                }
              />
              <Route
                index
                path="/dashboard/gem_Details"
                element={
                  storedUserData &&
                  (storedUserData.team === "Admin" ||
                    storedUserData.team === "Sales" ||
                    storedUserData.team === "Pricing" ||
                    storedUserData.team === "Marketing") && <GemView />
                }
              />
              <Route
                index
                element={
                  storedUserData &&
                  storedUserData.team === "Admin" &&
                  storedUserData.team !== "Executive" && <AuditingTable />
                }
                path={"/dashboard/auditing_table"}
              />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </Router>
    );
  }
}

export default App;