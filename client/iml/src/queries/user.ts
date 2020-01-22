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
                    email
                    approvalStatus
                    isAdmin
                    username
                    phoneNum
                }
            }
        }
    }
`


export const REGISTER_MUTATION = gql`
mutation Register($first: String!, $last: String!, $email: String!,
  $phoneNum: String, $registrationCode: String!, $password: String! ) {
      register(userData: {
          first: $first,
          last: $last,
          email: $email,
          phoneNum: $phoneNum
      }, password: $password, registrationCode: $registrationCode) {
          user {
              id
              username
              first
              last
              schoolId 
          }
      }
  }

`
