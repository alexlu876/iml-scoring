FROM ubuntu:16.04

MAINTAINER NYC IML "it@nyciml.org"


RUN apt-get update -y && apt-get install -y python-pip python-dev
COPY ./requirements.txt
RUN pip install -r requirements.txt
COPY . /app
# TODO - Gunicorn or other wsgi?
ENTRYPOINT [ "python" ]
CMD ["app.py"]

