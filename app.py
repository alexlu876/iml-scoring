from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)
X = 'your mom gay'

@app.route('/hello/<name>')
def hello_world(name):
    return render_template('temp.html', X=name)

@app.route('/')
def hello_j():
    return render_template('temp.html', X=request.remote_addr)

