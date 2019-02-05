from datetime import datetime

from iml.database import db
from iml.models import User

from iml.util import get_user

# keep in mind this is different from bcypt's gensalt
from werkzeug.security import gen_salt

from authlib.flask.oauth2 import AuthorizationServer, ResourceProtector
from authlib.flask.oauth2.sqla import (
    OAuth2ClientMixin,
    OAuth2AuthorizationCodeMixin,
    OAuth2TokenMixin,
    create_query_client_func,
    create_save_token_func,
    create_revocation_endpoint,
    create_bearer_token_validator
)

# actual oauth2 spec grants
from authlib.specs.rfc6749 import grants




# this is all currently based off the authlib example
# until our understanding of their implementation
# becomes a bit better
# https://github.com/authlib/example-oauth2-server/blob/master/website/models.py

class OAuth2Client(db.Model, OAuth2ClientMixin):
    __tablename__ = 'oauth2_clients'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(
                            'users.id',
                            ondelete='CASCADE'))
    user = db.relationship('User')


class OAuth2AuthorizationCode(db.Model,
                              OAuth2AuthorizationCodeMixin):
    __tablename__ = 'oauth2_codes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(
                            'users.id',
                            ondelete='CASCADE'))
    user = db.relationship('User')


class OAuth2Token(db.Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_tokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(
                            'users.id',
                            ondelete='CASCADE'))
    user = db.relationship('User')

    def isRefreshTokenExpired(self):
        expires_at = self.issued_at + self.expires_in
        return expires_at < datetime.utcnow()

    def is_refresh_token_expired(self):
        return self.isRefreshTokenExpired()


class AuthorizationCodeGrant(grants.AuthorizationCodeGrant):
    def create_authorization_code(self, client, user, request):
        code = gen_salt(48)
        auth_code_obj = OAuth2AuthorizationCode(
            code=code,
            client_id=client.client_id,
            redirect_uri=request.redirect_uri,
            scope=request.scope,
            user_id=user.id,
        )
        db.session.add(auth_code_obj)
        db.session.commit()
        return code

    def parse_authorization_code(self, code, client):
        auth_code_obj = OAuth2AuthorizationCode.query.filter_by(
            code=code, client_id=client.client_id).first()
        if auth_code_obj and not auth_code_obj.is_expired():
            return auth_code_obj
        return None

    def delete_authorization_code(self, authorization_code):
        db.session.delete(authorization_code)
        db.session.commit()
    def authenticate_user(self, authorization_code):
        return get_user(authorization_code.id)


class PasswordGrant(grants.ResourceOwnerPasswordCredentialsGrant):
    def authenticate_user(self, username, password):
        user = User.query.filter_by(email=username).first()
        if user and user.checkPassword(password):
            return user
        return None

class RefreshTokenGrant(grants.RefreshTokenGrant):
    def authenticate_refresh_token(self, refresh_token):
        token_obj = OAuth2Token.query.filter_by(
            refresh_token=refresh_token).first()
        if token_obj and not token_obj.isRefreshTokenExpired():
            return token_obj
        return None

    def authenticate_user(self, credential):
        return get_user(credential.user_id)


# create automatic oauth server to attach to webapp

query_client = create_query_client_func(db.session,
                                        OAuth2Client)
save_token = create_save_token_func(db.session,
                                    OAuth2Token)
authorization = AuthorizationServer(
    query_client=query_client,
    save_token=save_token,
)
require_oauth = ResourceProtector()

def config_oauth(app):
    authorization.init_app(app)
    # all grant types
    authorization.register_grant(grants.ImplicitGrant)
    authorization.register_grant(grants.ClientCredentialsGrant)
    # custom grants
    authorization.register_grant(AuthorizationCodeGrant)
    authorization.register_grant(PasswordGrant)
    authorization.register_grant(RefreshTokenGrant)

    # revocations
    revocation_class = create_revocation_endpoint(db.session,
                                                OAuth2Token)
    authorization.register_endpoint(revocation_class)

    bearer_class = create_bearer_token_validator(db.session,
                                                 OAuth2Token)
    # make sure to instantiate bearer object instance
    require_oauth.register_token_validator(bearer_class())
