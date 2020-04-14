import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


channels = dict()

@app.route("/")
def index():
    return render_template("index.html", channels=channels)


@socketio.on("add channel")
def add_channel(data):
    c_name = data["c_name"]
    if c_name not in channels:
        channels[c_name] = []
        return emit("show channel", {"response": True, "cName": c_name}, broadcast=True)
    else:
        return emit("show channel", {"response": False}, broadcast=True)


@socketio.on("append message")
def append_msg(data):
    print(data)
    c_name = data['c_name']
    
    if c_name in channels:
        if (len(channels[c_name]) >= 100):
            # slice away the part that's not needed thereby deleting oldest 20 messages.
            channels[c_name] = channels[c_name][20:]

        channels[c_name].append({'name': data['name'], 'time': data['time'],
                                 'message': data['message']})
        emit('show message', data, broadcast=True)
    else:
        # do nothing
        pass


def validate(c_name, val):
    """
    Validates if the range needed is fit for proper slicing
    """
    n = 80
    threshold = 4
    while (threshold >= 0):
        if ((len(channels[c_name]) > n) and (val <= threshold)):
            return True
        else:
            n -= 20
            threshold -= 1

    return False


@app.route('/get_messages/<c_name>/<int:val>', methods=["GET"])
def get_messages(c_name, val):
    if not (0 <= val and val <= 4):
        # if value outside range then return nothing
        return jsonify({'messages': []})
    else:
        if validate(c_name, val):
            # 20 messages max will be send at a time
            # compute the lidx and midx for slicing
            midx = None
            lidx = len(channels[c_name]) - (val * 20)
            if ((lidx - 20) > 0):
                midx = lidx - 20

            try:
                return jsonify({'messages': channels[c_name][lidx:midx:-1]})
            except KeyError:
                pass
        else:
            return jsonify({'messages': []})