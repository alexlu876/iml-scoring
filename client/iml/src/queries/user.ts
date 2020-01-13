import gql from 'graphql-tag';

export const VIEWER_QUERY = gql`
query CurrentUserForLayout {
    viewer {
        first
        last
        isAdmin
        approvalStatus
        email
        school {
            name
        }
    }
}
`;


export const AUTH = gql`
mutation AuthenticateUser($email: String! $password:String!) {
    auth(
        email: $email,
        password: $password
    ) {
        refreshToken
        accessToken
    }

}
`

export const USERS_QUERY = gql`
    {
        users {
            edges {
                node {
                    id
                }
            }
        }
    }
`


// export const REGISTER = gql`
// mutation R
// `
