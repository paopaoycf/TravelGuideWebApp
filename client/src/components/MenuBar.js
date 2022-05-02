import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

import travelImgPath from './travel.png'

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="light" theme="light" expand="md">
        <NavbarBrand href="/"><img src={travelImgPath} alt='Travel Guide in Covid' width='30' height='30' /> &nbsp;&nbsp;Travel Guide in Covid</NavbarBrand>
          <Nav navbar >
            {/* <NavItem>
              <NavLink active href="/">
              &nbsp;&nbsp;Home
              </NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink active href="/international">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;International Stats.
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/domestic">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U.S. Stats.
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/findproviders" >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Find COVID-19 Vaccines
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/findfacilities" >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Need Urgent Care
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
