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
            currentStudents {
                edges {
                    node {
                        id
                        first
                        last
                        username
                    }
                }
            }
        }
        questionCount
        scores {
            edges {
                node {
                    id
                    question {
                        questionNum
                    }
                    team {
                        id
                        name
                    }
                    teamId
                    studentId
                    student {
                        id
                        school {
                            name
                            id
                        }
                        first
                        last
                    }
                    pointsAwarded
                }
            }
        }
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
                        questionNum
                        questionValue
                    }
                    pointsAwarded
                }
            }
        }
    }
}
`

export const DELETE_SCORE = gql`
mutation DeleteScore($studentId: ID!, $contestId: ID!) {
    deleteScore(studentId:$studentId, contestId: $contestId) {
        success
    }
}
`

export const SIMPLE_SCORE_BY_CONTEST = gql`
query SimpleScoreByContest($contestId: ID!, $studentId: ID!) {
    simpleScoreByContest (contestId: $contestId, studentId: $studentId) {
        pointsAwarded
        questionNum
    }
}
`
