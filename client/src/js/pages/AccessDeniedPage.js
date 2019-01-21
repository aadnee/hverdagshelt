import React from 'react';
import {Component} from 'react';
import {Container, Grid, Segment} from 'semantic-ui-react';

export class AccessDeniedPage extends Component {
    render() {
        return (
            <Container>
                <Grid centered>
                    <Grid.Column>
                        <h1>Tilgang til siden nektet (403)</h1>
                        <Segment stacked color="blue" basic>
                            <p>Du har dessverre ikke tilgang til siden du ser etter.</p>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}