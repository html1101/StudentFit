import flask
from flask import request, jsonify, Response, send_file
from PIL import Image
import os.path

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
    "csv": "text/csv",
    "jpg": "image/jpeg",
    "ico": "image/vnd.microsoft.icon"
}

@app.route("/frontend/<string:file_name>", methods=['GET'])
def get_req(file_name):
    # Read the file here and return it
    try:
        file_ending = file_name.split(".")[1]
    except:
        # Assume 404 error
        file_ending = "html"

    if not os.path.isfile(F"frontend/{file_name}"):
        # File doesn't exist
        file_name = "about.html"
    # Look at the MIME type based on the end of the file name(ex. if .html, send as a text/html file, etc)
    # Then return the read file and its mime type.
    # Using try: (read file and return text) and except: Response(404 text)
    return send_file(F"frontend/{file_name}", mimetype=MIME_types.get(file_ending, "text/html"))


@app.route("/events.csv", methods=['POST'])
def post_csv():
    dataArr = request.data.decode("utf-8").split("&")
    dataO = {}
    for i in dataArr:
        spl = i.split("=")
        dataO[spl[0]] = spl[1]
    """
    Format: name="something", date="date for something", type="homework, test, assignment, etc", finished="whether it's formatted or not"
    """
    writeEvents = open("events.csv", "a")
    writeEvents.write(F"\n{dataO.get('name')}, {dataO.get('date')}, {dataO.get('type')}, 0")
    writeEvents.close()
    return Response(open("events.csv", "r+").read(), "text/csv")

@app.route("/events.csv", methods=["PUT"])
def update_csv():
    dataArr = request.data.decode("utf-8").split("&")
    dataO = {}
    for i in dataArr:
        spl = i.split("=")
        dataO[spl[0]] = spl[1]
    # Find corresponding name and change finished type(we're going to assume that's why they're updating)
    read_csv = open("events.csv", "r+").read()
    newA = []
    read_csv = read_csv.split("\n")
    for i in read_csv:
        i = i.split(", ")
        newA.append(i)
        if dataO["name"] == i[0] and dataO["date"] == i[1]:
            newA[-1] = [i[0], i[1], dataO["type"], dataO["finished"]]
    # Write to CSV now
    newS = []
    for i in newA:
        newS.append(", ".join(i))
    with open("events.csv", "w+") as f:
        f.write("\n".join(newS))
    return "\n".join(newS)
    

@app.route("/events.csv", methods=['GET'])
def get_csv():
    # info
    readEvents = open("events.csv", "r+").read()
    return Response(readEvents, mimetype=MIME_types.get("csv", "text/plain"))


app.run()