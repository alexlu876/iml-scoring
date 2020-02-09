// FROM material-ui examples: https://github.com/mui-org/material-ui/blob/2f6a982aa74ffa46680798089ad20ed67ed0c5ae/docs/src/pages/getting-started/page-layout-examples/blog/Blog.js
import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
const styles = theme => ({
    listItem: {
        marginTop: theme.spacing(1),
    },
});

const options = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: 'h5',
            },
        },
        h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
        h4: {
            component: Typography,
            props: { gutterBottom: true, variant: 'caption', paragraph: true },
        },
        p: { component: Typography, props: { paragraph: true } },
        a: { component: Link },
        li: {
            component: withStyles(styles)(({ classes, ...props }) => (
                <li className={classes.listItem}>
                    <Typography component="span" {...props} />
                </li>
            )),
        },
    },
};

export default function Markdown(props) {
    return <ReactMarkdown options={options} {...props} />;
}
