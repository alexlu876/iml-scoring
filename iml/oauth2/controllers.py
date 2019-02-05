from flask import Blueprint, request, session, flash
from flask import render_template, redirect, jsonify
from authlib.flask.oauth2 import current_token
from authlib.specs.rfc6749 import OAuth2Error

from werkzeug.security import gen_salt

from iml.database import db
from iml.models import User
from iml.util import get_user, render_custom_template
from iml.oauth2 import OAuth2Client, authorization, require_oauth
from iml.forms import OAuth2ClientCreationForm, OAuth2AuthForm

from iml.core.user.wrappers import login_required

oauth2 = Blueprint(__name__, 'oauth2')

@oauth2.route('view_clients')
@login_required()
def view_clients():
    user = get_user(session["userdata"]["id"])
    clients = OAuth2Client.query.filter_by(user_id=user.id).all()
    return jsonify([(client.client_info, client.client_metadata) for client in clients]
                    )


@oauth2.route('/authorize', methods=['GET', 'POST'])
@login_required()
def authorize():
    user = get_user(session["userdata"]["id"])
    form = OAuth2AuthForm()
    if request.method == 'POST' and form.submit:
        return authorization.create_authorization_response(grant_user=user)
    else:
        grant = authorization.validate_consent_request(
                        end_user=user)
        return render_custom_template('oauth2/authorize.html', user=user,
                                      grant=grant,
                                      authForm=form)


@oauth2.route('/token', methods=['POST'])
def issue_token():
    return authorization.create_token_response()


@oauth2.route('/revoke', methods=['POST'])
def revoke_token():
    return authorization.create_endpoint_response('revocation')


@oauth2.route('/create_client', methods=['GET', 'POST'])
@login_required()
def create_client():
    user = get_user(session["userdata"]["id"])
    print(user.id)

    form = OAuth2ClientCreationForm()

    if form.validate_on_submit() and form.submit.data:
        client = OAuth2Client(client_name = form.client_name.data,
                              client_uri = form.client_uri.data,
                              scope = form.scope.data,
                              redirect_uri = form.redirect_uri.data,
                              grant_type = form.grant_type.data,
                              response_type = form.response_type.data,
                              token_endpoint_auth_method = form.token_endpoint_auth_method.data,
                              user_id = user.id
                              )
        client.client_id = gen_salt(24)
        if client.token_endpoint_auth_method == 'none':
            client.client_secret = ''
        else:
            client.client_secret = gen_salt(48)
        db.session.add(client)
        db.session.commit()
        flash("Successfully created oauth client!")
        return redirect("oauth2/create_client")


    # create client form validation + processing
    return render_custom_template('oauth2/create_client.html',
                                  clientForm = form)


@oauth2.route('/api/test')
@require_oauth('account')
def api_me():
    user = current_token.user
    return jsonify(id=user.id, username=user.username)

