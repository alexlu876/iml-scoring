import gql from 'graphql-tag'

export const CONTESTS_QUERY = gql`
query{
    contests {
        edges {
            node {
                id
                name
                division {
                    id
                    name
                }
                questionCount
                questions {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    }
}
`
export const CONTEST_BY_ID = gql`
query Contest($contestId: ID!) {
    contest (id: $contestId) {
        id
        name
        division {
            id
            name
        }
        questionCount
        questions {
            edges {
                node {
                    id
                }
            }
        }

    }
}
`

export const UPDATE_SCORE = gql`
mutation UpdateScore($studentId: ID!, $contestId: ID!, $scores: [ScoreInput] ) {
    updateScore(contestId: $contestId, studentId: $studentId, scores: $scores) {
        scores {
            edges {
                node {
                    id
                    question {
                        id
                        question_num
                        question_value
                    }
                    pointsAwarded
                }
            }
        }
    }
}

`
