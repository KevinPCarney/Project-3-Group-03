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

	#function to return nationality
    def query_nationality(self, nationality):
            
        Results = self.Base.classes.results        
        Drivers = self.Base.classes.drivers

		# Create our session (link) from Python to the DB
        session = Session(self.engine)

		# # #nationality
        # nationality = f"{nationality}"

		#query		
        driver_query = session.query(Drivers.forename, Drivers.surname, func.count(Results.position)).\
            filter(Drivers.driverId == Results.driverId).\
            filter(Results.position == 1).\
            filter(Drivers.nationality == f"{nationality}").\
            group_by(Drivers.forename, Drivers.surname).\
            order_by(func.count(Results.position).asc()).all()
		
        # close session
        session.close()

		#save query to dataframe
        df = pd.DataFrame(driver_query, columns=["forename", "surname", "wins"])	

        data = df.to_dict(orient="records")
        return(data)


    # # USING RAW SQL
    # def get_bar(self, min_attempts, region):

    #     # switch on user_region
    #     if region == 'All':
    #         where_clause = "and 1=1"
    #     else:
    #         where_clause = f"and region = '{region}'"

    #     # build the query
    #     query = f"""
    #         SELECT
    #             name,
    #             full_name,
    #             region,
    #             launch_attempts,
    #             launch_successes
    #         FROM
    #             launchpads
    #         WHERE
    #             launch_attempts >= {min_attempts}
    #             {where_clause}
    #         ORDER BY
    #             launch_attempts DESC;
    #     """

    #     df = pd.read_sql(text(query), con = self.engine)
    #     data = df.to_dict(orient="records")
    #     return(data)

    