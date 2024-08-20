import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///f1.sqlite")
        self.Base = None

        # automap Base classes
        self.init_base()

    # define bas
    def init_base(self):
        # reflect an existing database into a new model
        self.Base = automap_base()
        # reflect the tables
        self.Base.prepare(autoload_with=self.engine)

        #bases for query referencing 
        Circuits = self.Base.classes.circuits
        Constructors = self.Base.classes.constructors
        Drivers = self.Base.classes.drivers
        Results = self.Base.classes.results
        Races = self.Base.classes.races

    #################################################
    # Database Queries
    #################################################

    def dropdown_query(self):

        # base         
        Drivers = self.Base.classes.drivers

		# Create our session 
        session = Session(self.engine)

        # SQL query - ORM 
        dropdown_query = session.query(Drivers.nationality.distinct()).order_by(Drivers.nationality.asc()).all()

        # close session
        session.close()
        
        # save query to dataframe
        df = pd.DataFrame(dropdown_query, columns=["nationality"])

        data = df.to_dict(orient="records")
        return(data)


	#Drivers Nationality
    def bar_chart(self, nationality):

        # bases    
        Results = self.Base.classes.results        
        Drivers = self.Base.classes.drivers

		# Create our session (link) from Python to the DB
        session = Session(self.engine)

		# SQL query - ORM
        if nationality != 'All':
            driver_query = session.query(Drivers.forename, Drivers.surname, func.count(Results.position), Drivers.nationality).\
            filter(Drivers.driverId == Results.driverId).\
            filter(Results.position == 1).\
            filter(Drivers.nationality == f"{nationality}").\
            group_by(Drivers.forename, Drivers.surname).\
            order_by(func.count(Results.position).desc()).all()
        else:
            driver_query = session.query(Drivers.forename, Drivers.surname, func.count(Results.position), Drivers.nationality).\
            filter(Drivers.driverId == Results.driverId).\
            filter(Results.position == 1).\
            group_by(Drivers.forename, Drivers.surname).\
            order_by(func.count(Results.position).desc()).all()

        # close session
        session.close()

		#save query to dataframe
        df = pd.DataFrame(driver_query, columns=["first_name", "last_name", "wins", "nationality"])	

        data = df.to_dict(orient="records")
        return(data)
    
    #Bubble Chart
    def bubble_chart(self, nationality):

        # bases
        Results = self.Base.classes.results        
        Drivers = self.Base.classes.drivers

		#create session
        session = Session(self.engine)

        # SQL query - ORM 
        if nationality != 'All':
            bubble_query = session.query(Drivers.forename, Drivers.surname, func.count(Results.position), func.avg(Results.position), Drivers.nationality).\
            filter(Drivers.driverId == Results.driverId).\
            filter(Drivers.nationality == f"{nationality}").\
            group_by(Drivers.forename, Drivers.surname).\
            order_by(func.count(Results.position).desc()).all()
        else:
            bubble_query = session.query(Drivers.forename, Drivers.surname, func.count(Results.position), func.avg(Results.position), Drivers.nationality).\
            filter(Drivers.driverId == Results.driverId).\
            group_by(Drivers.forename, Drivers.surname).\
            order_by(func.count(Results.position).desc()).all() 

        # close session
        session.close()

        # save query to dataframe
        df = pd.DataFrame(bubble_query, columns=["first_name", "last_name", "number_races", "avg_finish", "nationality"])

        data = df.to_dict(orient="records")
        return(data) 

    #MAP
    def query_map(self, country):

        #base
        Circuits = self.Base.classes.circuits

        # Create our session (link) from Python to the DB
        session = Session(self.engine)

        #SQL query - ORM
        if country != 'All':
            map_query = session.query(Circuits.name, Circuits.location, Circuits.country, Circuits.lat, Circuits.lng).\
            filter(Circuits.country == f"{country}").all()
        else:
            map_query = session.query(Circuits.name, Circuits.location, Circuits.country, Circuits.lat, Circuits.lng).all()

        # close session
        session.close()

        #save query to dataframe
        df3 = pd.DataFrame(map_query, columns=["circuit_name", "city", "country", "latitude", "longitude"])

        data = df3.to_dict(orient="records")
        return(data)

    #SUNBURST CONSTRUCTOR
    def sunburst_query(self, min_year, max_year):

        #SQL query - RAW 
        query = f"""
            SELECT
                c.name as label,
                "" as parent,
                count(r.raceId) as num_races
            FROM
                constructors c 
                JOIN results r on c.constructorId = r.constructorId
                JOIN drivers d on d.driverId = r.driverId
                JOIN races ra on r.raceId = ra.raceId
            WHERE
                ra.year >= {min_year}
                AND ra.year <= {max_year}
            GROUP BY
                c.constructorId
            
            UNION ALL 

            SELECT
                d.forename || " " || d.surname || "<br>" || c.name as label,
                c.name as parent,
                count(r.raceId) as num_races
            FROM
                constructors c 
                JOIN results r on c.constructorId = r.constructorId
                JOIN drivers d on d.driverId = r.driverId
                JOIN races ra on r.raceId = ra.raceId
            WHERE
                ra.year >= {min_year}
                AND ra.year <= {max_year}
            GROUP BY
                d.driverId, 
                c.constructorId;
        """

        df_sunburst = pd.read_sql(text(query), con=self.engine)

        # #save query to dataframe
        # df = pd.DataFrame(constructor_query, columns=["constructor", "first_name", "last_name"])   
        
        data = df_sunburst.to_dict(orient="records")
        return(data)