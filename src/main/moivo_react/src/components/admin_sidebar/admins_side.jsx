import React from 'react';
import { Link } from 'react-router-dom';
import admin_sidebar from '../../assets/css/admin_side.module.css';

const admins_side = () => {
    return (
        <div className={admin_sidebar.area}>
          <nav className={admin_sidebar.mainMenu}>
            <ul>
              {/* Dashboard */}
              <li>
                <Link to="/admins_dashboard">
                  <i className="fa fa-tachometer-alt fa-2x"></i>
                  <span className={admin_sidebar.navText}>Dashboard</span>
                </Link>
              </li>
    
              {/* Products */}
              <li className={admin_sidebar.hasSubnav}>
                <a href="#">
                  <i className="fa fa-cube fa-2x"></i>
                  <span className={admin_sidebar.navText}>Products</span>
                </a>
              </li>
    
              {/* Customers */}
              <li className={admin_sidebar.hasSubnav}>
                <a href="#">
                  <i className="fa fa-users fa-2x"></i>
                  <span className={admin_sidebar.navText}>Customers</span>
                </a>
              </li>
    
              {/* User Roles */}
              <li className={admin_sidebar.hasSubnav}>
                <a href="#">
                  <i className="fa fa-user fa-2x"></i>
                  <span className={admin_sidebar.navText}>User Roles</span>
                </a>
              </li>
    
              {/* Notices */}
              <li>
                <a href="#">
                  <i className="fa fa-bullhorn fa-2x"></i>
                  <span className={admin_sidebar.navText}>Notices</span>
                </a>
              </li>
    
              {/* Reviews */}
              <li>
                <a href="#">
                  <i className="fa fa-star fa-2x"></i>
                  <span className={admin_sidebar.navText}>Reviews</span>
                </a>
              </li>
            </ul>
    
            {/* Logout */}
            <ul className={admin_sidebar.logout}>
              <li>
                <a href="#">
                  <i className="fa fa-power-off fa-2x"></i>
                  <span className={admin_sidebar.navText}>Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      );
    };
    

export default admins_side;