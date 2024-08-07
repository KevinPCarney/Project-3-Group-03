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

# # HTML ROUTES
# @app.route("/")
# def index():
#     return render_template("home.html")

# # HTML ROUTES
# @app.route("/dashboard")
# def index():
#     return render_template("dashboard.html")

# # HTML ROUTES
# @app.route("/circuit_map")
# def index():
#     return render_template("circuit_map.html")

# # HTML ROUTES
# @app.route("/sunburst")
# def index():
#     return render_template("sunburst.html")

# # HTML ROUTES
# @app.route("/about_us")
# def index():
#     return render_template("about_us.html")

# # HTML ROUTES
# @app.route("/work_cited")
# def index():
#     return render_template("work_cited.html")

SQL Queries
@app.route("/api/v1.0/get_dashboard/<min_attempts>/<region>")
def get_dashboard(min_attempts, region):
    min_attempts = int(min_attempts) # cast to int

    bar_data = sql.get_bar(min_attempts, region)
    pie_data = sql.get_pie(min_attempts, region)
    table_data = sql.get_table(min_attempts, region)

    data = {
        "bar_data": bar_data,
        "pie_data": pie_data,
        "table_data": table_data
    }
    return(jsonify(data))

@app.route("/api/v1.0/get_map/<min_attempts>/<region>")
def get_map(min_attempts, region):
    min_attempts = int(min_attempts) # cast to int
    map_data = sql.get_map(min_attempts, region)

    return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)