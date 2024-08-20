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

# HTML ROUTES - HOME
@app.route("/")
def index():
    return render_template("home.html")

# HTML ROUTES - DASHBOARD
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# HTML ROUTES - SUNBURST
@app.route("/sunburst")
def sunburst():
    return render_template("sunburst.html")

# HTML ROUTES - MAP
@app.route("/map")
def map():
    return render_template("map.html")

# HTML ROUTES - ABOUT US 
@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

# HTML ROUTES - SOURCES
@app.route("/sources")
def sources():
    return render_template("sources.html")


# API DASHBOARD DROPDOWN 
@app.route("/api/v1.0/get_dropdown")
def get_dropdown():    
    data = sql.dropdown_query()

    return(jsonify(data))

# API DASHBOARD BAR & BUBBLE CHART
@app.route("/api/v1.0/get_dashboard/<nationality>")
def get_dashboard(nationality):
    bar_data = sql.bar_chart(nationality)
    bubble_data = sql.bubble_chart(nationality)

    data = {
        "bar_data": bar_data,
        "bubble_data": bubble_data
    }

    return(jsonify(data))

# API MAP w/ filter
@app.route("/api/v1.0/get_map/<country>")
def get_map(country):
    data = sql.query_map(country)
    return(jsonify(data))

# API SUNBURST
@app.route("/api/v1.0/get_sunburst/<min_year>/<max_year>")
def get_sunburst(min_year, max_year):
    data = sql.sunburst_query(min_year, max_year)
    return(jsonify(data))

# Run the App
if __name__ == '__main__':
    app.run(debug=True)