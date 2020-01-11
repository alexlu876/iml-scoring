import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'
import {
    SEASONS_QUERY,
    DIVISIONS_QUERY
} from '../../queries/division';

