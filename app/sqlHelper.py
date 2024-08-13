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


    def init_base(self):
        # reflect an existing database into a new model
        self.Base = automap_base()
        # reflect the tables
        self.Base.prepare(autoload_with=self.engine)


        Circuits = self.Base.classes.circuits
        Constructors = self.Base.classes.constructors
        Drivers = self.Base.classes.drivers
        Results = self.Base.classes.results
        Races = self.Base.classes.races


    #################################################
    # Database Queries
    #################################################


    def dropdown_query(self):
                 
        Drivers = self.Base.classes.drivers

		# Create our session (link) from Python to the DB
        session = Session(self.engine)

        dropdown_query = session.query(Drivers.nationality.distinct()).order_by(Drivers.nationality.asc()).all()

        # close session
        session.close()
        
        df = pd.DataFrame(dropdown_query, columns=["nationality"])

        data = df.to_dict(orient="records")
        return(data)


	#Drivers Nationality
    def bar_chart(self, nationality):
            
        Results = self.Base.classes.results        
        Drivers = self.Base.classes.drivers

		# Create our session (link) from Python to the DB
        session = Session(self.engine)

		# nationality
        # nationality = f"{nationality}"
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
    
    #Drivers Wins
    def bubble_chart(self, nationality):

        Results = self.Base.classes.results        
        Drivers = self.Base.classes.drivers

		# Create our session (link) from Python to the DB
        session = Session(self.engine)

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

        df = pd.DataFrame(bubble_query, columns=["first_name", "last_name", "number_races", "avg_finish", "nationality"])

        data = df.to_dict(orient="records")
        return(data) 

    #MAP
    def query_map(self, country):
        
        Circuits = self.Base.classes.circuits

        # Create our session (link) from Python to the DB
        session = Session(self.engine)

        #query
        # map_query = session.query(Circuits.name, Circuits.location, Circuits.country, Circuits.lat, Circuits.lng).all()		
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
    def sunburst_query(self):

        Constructors = self.Base.classes.constructors
        Drivers = self.Base.classes.drivers
        Results = self.Base.classes.results

        # Create our session (link) from Python to the DB
        session = Session(self.engine)

        #query
        constructor_query = session.query(Constructors.name, Drivers.forename, Drivers.surname).\
            filter(Constructors.constructorId == Results.constructorId).\
            filter(Drivers.driverId == Results.driverId).\
            order_by(Constructors.name.asc()).all()
        
        #close session
        session.close()

        #save query to dataframe
        df = pd.DataFrame(constructor_query, columns=["constructor", "driver_first", "driver_last"])   
        
        data = df.to_dict(orient="records")
        return(data)