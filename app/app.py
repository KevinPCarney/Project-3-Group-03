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
@app.route("/sunburst")
def sunburst():
    return render_template("sunburst.html")

# HTML ROUTES
@app.route("/map")
def map():
    return render_template("map.html")

# HTML ROUTES
@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

# HTML ROUTES
@app.route("/sources")
def sources():
    return render_template("sources.html")




# SQL Queries BUILD OUT DASHBOARD
@app.route("/api/v1.0/get_dropdown")
def get_dropdown():    
    data = sql.dropdown_query()

    return(jsonify(data))

#BAR & BUBBLE CHART
@app.route("/api/v1.0/get_dashboard/<nationality>")
def get_dashboard(nationality):
    bar_data = sql.bar_chart(nationality)
    bubble_data = sql.bubble_chart(nationality)

    data = {
        "bar_data": bar_data,
        "bubble_data": bubble_data
    }

    return(jsonify(data))

# #MAP w/ filter
@app.route("/api/v1.0/get_map/<country>")
def get_map(country):
    data = sql.query_map(country)
    return(jsonify(data))

# #MAP
# @app.route("/api/v1.0/get_map")
# def get_map():
#     data = sql.query_map()
#     return(jsonify(data))

#SUNBURST
#NEEDS CHANGED TO COME BACK AS LIST OF DICT
@app.route("/api/v1.0/get_sunburst")
def get_sunburst():
    data = sql.sunburst_query()
    return(jsonify(data))

# Run the App
if __name__ == '__main__':
    app.run(debug=True)