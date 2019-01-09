import React from 'react';
import {Component} from 'react';
import {Divider, Segment, Container, Grid, List, Header, Image} from 'semantic-ui-react';

//import {} from './';

export class NewsCaseWidget extends Component {
    render() {
        return (
            <Segment color='teal'>
                <Container>
                    <Segment vertical>
                        <Grid divided inverted stackable>
                            <Grid.Column width={12} textAlign='left'>
                                <Header as='h2'>Tittel</Header>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign='right'>
                                <p>dd/mm/yy</p>
                                <p><i>00:00</i></p>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment vertical>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Column width={12} textAlign='left'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas ipsum nec
                                        purus bibendum hendrerit. Suspendisse consequat ullamcorper mi vel commodo. In
                                        commodo dolor tellus, nec sodales enim ullamcorper a. Sed ultrices sapien
                                        eleifend augue finibus ultricies. Suspendisse vitae lacus augue. Praesent
                                        efficitur pulvinar egestas. Suspendisse dictum condimentum diam.
                                        <br/><br/>
                                        Mauris rhoncus tristique velit. Nullam efficitur erat in dui interdum, faucibus
                                        congue erat lobortis. Donec luctus, justo et venenatis ultricies, sapien ligula
                                        sollicitudin
                                        elit, sed blandit enim risus non felis. Fusce eget elit nunc. Donec dignissim
                                        pellentesque luctus. Donec et purus ligula. Etiam eleifend non mauris a
                                        hendrerit.
                                    </p>
                                </Grid.Column>
                                <Grid.Column width={3} align='right'>
                                    <Image
                                        src='https://avisenagder.no/bilder/nyheter/nyhetbig/52921.jpg'
                                        as='a'
                                        size='medium'
                                        href='http://localhost:3000/#/widget'
                                        target='_blank'
                                    />
                                </Grid.Column>
                            </Grid>
                        </Container>
                    </Segment>
                    <List link>
                        <List.Item as='a'>Hendelses-adresse: blabla</List.Item>
                        <List.Item as='a'>Oppdrag utføres av: blabla</List.Item>
                    </List>
                </Container>
            </Segment>
        );
    }
}
