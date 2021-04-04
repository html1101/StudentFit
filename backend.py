import flask
from flask import request, jsonify, Response

app = flask.Flask(__name__)
app.config["DEBUG"] = True

"""
So, we want to create something that can open any file in /frontend.
We can open a file through:
open(F"frontend/{name_of_file}", "r+").read()
So 
"""

MIME_types = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "csv": "text/csv"
}

@app.route("/frontend/<string:file_name>", methods=['GET'])
def get_req(file_name):
    # Read the file here and return it
    try:
        text = open(F"frontend/{file_name}", "r+").read()
    except:
        file_name = "404.html"
        text = open(F"frontend/404.html", "r+").read()
    # Look at the MIME type based on the end of the file name(ex. if .html, send as a text/html file, etc)
    # Then return the read file and its mime type.
    # Using try: (read file and return text) and except: Response(404 text)
    return Response(text, mimetype=MIME_types.get(file_name.split(".")[1], "text/plain"))


@app.route("/events.csv", methods=['POST'])
def post_csv():
    dataArr = request.data.decode("utf-8").split("&")
    dataO = {}
    print(dataArr)
    for i in dataArr:
        spl = i.split("=")
        dataO[spl[0]] = spl[1]
    """
    Format: name="something", date="date for something", type="homework, test, assignment, etc"
    """
    writeEvents = open("events.csv", "a")
    print(dataO)
    writeEvents.write(F"\n{dataO.get('name')}, {dataO.get('date')}, {dataO.get('type')}")
    writeEvents.close()
    return Response(open("events.csv", "r+").read(), "text/csv")


@app.route("/events.csv", methods=['GET'])
def get_csv():
    # info
    readEvents = open("events.csv", "r+").read()
    print(readEvents)
    return Response(readEvents, mimetype=MIME_types.get("csv", "text/plain"))


app.run()