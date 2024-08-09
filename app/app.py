from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################


# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

# HTML ROUTES
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# HTML ROUTES
@app.route("/map")
def map():
    return render_template("map.html")


# SQL Queries BUILD OUT DASHBOARD
@app.route("/api/v1.0/get_dropdown")
def get_dropdown():    
    data = sql.dropdown_query()

    return(jsonify(data))

@app.route("/api/v1.0/get_dashboard/<nationality>")
def get_dashboard(nationality):
    bar_data = sql.query_nationality(nationality)
    bubble_data = sql.bubble_chart(nationality)

    data = {
        "bar_data": bar_data,
        "bubble_data": bubble_data
    }

    return(jsonify(data))

@app.route("/api/v1.0/get_map")
def get_map():
    data = sql.query_map()
    return(jsonify(data))
    
#BOOTH CODE FOR SPACE X DASHBOARD
# @app.route("/api/v1.0/get_dashboard/<min_attempts>/<region>")
# def get_dashboard(min_attempts, region):
#     min_attempts = int(min_attempts) # cast to int

#     bar_data = sql.get_bar(min_attempts, region)
#     pie_data = sql.get_pie(min_attempts, region)
#     table_data = sql.get_table(min_attempts, region)

#     data = {
#         "bar_data": bar_data,
#         "pie_data": pie_data,
#         "table_data": table_data
#     }
#     return(jsonify(data))

# @app.route("/api/v1.0/get_map/<min_attempts>/<region>")
# def get_map(min_attempts, region):
#     min_attempts = int(min_attempts) # cast to int
#     map_data = sql.get_map(min_attempts, region)

#     return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)