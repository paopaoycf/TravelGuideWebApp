import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import HomePage from './pages/HomePage';
import DomesticPage from './pages/DomesticPage';
import InternationalPage from './pages/InternationalPage';
import FindCareFacilitiesPage from './pages/FindCareFacilitiesPage';
import FindProvidersPage from './pages/FindProvidersPage';
import ProviderDetailPage from './pages/ProviderDetailPage';
import StatePage from './pages/StatePage';
import CountryDetailPage from './pages/CountryDetailPage';

ReactDOM.render(
	<div>
		<Router>
			<Switch>
				<Route exact
					path="/"
					render={() => (
						<HomePage />
					)} />
				<Route exact
					path="/domestic"
					render={() => (
						<DomesticPage />
					)} />
				<Route exact
					path="/international"
					render={() => (
						<InternationalPage />
					)} />
				<Route exact
					path="/country-detail/:country"
					render={() => (
						<CountryDetailPage />
					)} />
				<Route exact
					path="/findfacilities"
					render={() => (
						<FindCareFacilitiesPage />
					)} />
				<Route exact
					path="/findproviders"
					render={() => (
						<FindProvidersPage />
					)} />
				<Route exact
					path="/provider"
					render={() => (
						<ProviderDetailPage />
					)} />
				<Route exact
					path="/state"
					render={() => (
						<StatePage />
					)} />
			</Switch>
		</Router>
	</div>,
	document.getElementById('root')
);

