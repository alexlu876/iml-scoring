import gql from 'graphql-tag';

export const VIEWER_QUERY = gql`
query CurrentUserForLayout {
    viewer {
        first
        last
    }
}
`;
