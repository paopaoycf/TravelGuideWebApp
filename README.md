# Web App: Travel Guide In Covid

## Introduction
<b>Travel Guide in Covid</b>, is an interactive web application that allows users to view and search for COVID-19 related travel information, including:
* <i>For trip planning: </i> 
Check recent COVID situation and travel restrictions both internationally by country or
domestically by U.S. states;
* <i>Before the trip: </i> Search COVID-19 vaccine provider locations which helps the user to make an
appointment.
* <i>During the trip (only for domestic travel):</i> Find an urgent care facility if you need medical assistance.

## System Architecture
The project adopts the client-server architecture with the front-end being rendered by the framework of React for its efficient virtual DOM that keeps track of web page updates with light-weight javascript objects as well as the Diffing Algorithm. Additionally, the independent components and abundant open-source APIs guarantee a productive and professional development environment. The server was implemented with the methods of express, mysql, and cors, which support the asynchronous single-threaded communications between the client and the databases. The relational databases (RD) instance of MySQL was created and hosted on the cloud platform of Amazon Web Services (AWS) with 20 Gib of allocated disk space and supports inbound/outbound of ipv4 and ipv6 internet communication. 

## Demo video

https://drive.google.com/file/d/1IXGfLqT3ikd8RWy7iNDO2lhZObOx_uGz/view?usp=sharing


## Functional Pages
### Home page
The homepage welcomes users to the app, giving an outline of what the app can help the user to plan the trip
with latest information about the travel restriction and pandemic situation, to get fully vaccinated before going,
to search urgent care facilities during the trip. For each dedicated functional page, the homepage provides 3
easy entries: by hyperlink on short sentences, by navigation link on menu bar, by carousel image.

### International Statistics page
A world map is shown for international destinations. The maps are color coded based on accessibility and
restriction levels. When users hover over a particular country, they would see a pop up with some highlights (i.e. the current stringency index, community transmission level, etc). When users click on a particular country,
they would be brought to a second page which includes more detailed policy information (i.e. what is the local
quarantine policy, face covering policy, public gathering policy, etc.) as well as information on confirmed cases,
vaccination, and deaths for the destination selected.

### U.S. Domestic Statistics page
A US state map is shown for domestic destinations with granularity of state. The map is color coded based on the daily new cases in thousand and an event of mouse hovering will pop out a tooltip to show the corresponding COVID stats in that state, which could be specified by selecting the date. There will also be a table underneath displaying the stats by state and mask mandates policies (if any), which ranks the states with the most counties of moderate or low risk on the top. Upon the click on a state in the map or on a row in the table, the browser will go to another page that displays the table of community transmission level and population by counties for the selected state and date. The users may change the date and state by interest.

### Find Vaccine Providers page
The user can input a U.S zip code and select a specific vaccine medicine, the app will return 50 vaccine providers near the given zip that provides the chosen vaccine medicine. Those 50 results are shown on the google map with a number Marker, which indicates the order of the distance to the given zip (in ascending order). On the result list, some color tags indicate whether the provider has medicine in stock, whether it opens on weekends, etc. For the user’s convenience, they can only filter out those providers that are in stock from the 50 results. The markers are updated on the filtering. The google map is able to auto zoom and auto center to accommodate the updated search result. By clicking the shown info window on the Marker or clicking a provider in the result list, they would be brought to a second page which includes more detailed information about the vaccine provider, including vaccine stock for all the medicine it provides, web link, prescreen link, open hours, whether appointment is available.

### Find Urgent Care Facilities page
The user can search urgent care facilities either by county or by keyword. By clicking one facility in the searched result, it shows the detailed information in the bottom of the page and also gives 8 nearby facilities that the user might also be interested in.


## Co-developers

| Name | GitHub Username | Responsibilities |
| :---: | :---: | :---: |
|Chenfei Yu | paopaoycf | findVaccineProvider(fullstack), findUrgentCare(fullstack） |
|Shentong Lu | PP-Papa | domesticStat(fullstack)|
|Leyi Cao | leyicao | internationalStat(frontend) | 
|Bing Yang | coldstaryb | internationalStat(backend) | 

## Package Dependency

Download and install the basic dependencies into the node_modules folder under both server folder and client folder

    npm install


## Database Credentials

    "rds_host": "cis550database-1.csahpvg4jbzs.us-east-1.rds.amazonaws.com",
    "rds_port": "3306",
    "rds_user": "paopaoycf",
    "rds_password" : "(hide, please contact me)",
    "rds_db": "TravelCovid",
    "server_host": "127.0.0.1",
    "server_port":"8080"
