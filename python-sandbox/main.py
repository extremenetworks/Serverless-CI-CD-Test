"""GCP HTTP Cloud Function Example."""
# -*- coding: utf-8 -*-

import json
import datetime
import firebase_admin
from firebase_admin import credentials


def endpoint(request):
    """GCP HTTP Cloud Function Example.
    Args:
        request (flask.Request)
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/0.12/api/#flask.Flask.make_response>.
    """
    print("I am hitting here")
    current_time = datetime.datetime.now().time()
    body = {
        "message": "Received a {} request at {}".format(request.method, str(current_time))
    }

    response = {
        "statusCode": 200,
        "body": body
    }

    return json.dumps(response, indent=4)
