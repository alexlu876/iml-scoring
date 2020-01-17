import gql from 'graphql-tag';

export const VIEWER_SCHOOLS_QUERY = gql`
query CurrentUsersSchool {
    viewerSchool {
        name
        id
        schoolGrouping {
            name
        }
        coaches {
            edges {
                node {
                    first
                    last
                    id
                    email
                }
            }
        }
        divisions {
            edges {
                node {
                    name
                    id
                }
            }
        }
    }
}
`


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
            id
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
                    first
                    last
                    schoolId
                    approvalStatus
                    isAdmin
                    username
                    phoneNum
                }
            }
        }
    }
`
