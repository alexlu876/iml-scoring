import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui//core/Typography';

export default function CardTitle(props : any) {
    return (
        <Typography component="h2" variant = "h5" color="secondary" gutterBottom>
            {props.children}
        </Typography>
    )
};

CardTitle.propTypes = {
    children: PropTypes.node,
};
