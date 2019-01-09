import React from 'react';
import {Segment, Container, Grid, List, Header, Image} from 'semantic-ui-react';

//import {} from './';

export class FooterWidget extends Component {
    render() {
        return (
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Image
                                    src='hverdagshelt/client/public/img/hverdagshelt_logo_hvit.png'
                                    as='a'
                                    size='medium'
                                    href='//localhost:3000/#/widget'
                                    target='_blank'
                                />  
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Kontakt' />
                                <List link inverted>
                                    <List.Item as='a'>Scrumgruppe 8</List.Item>
                                    <List.Item as='a'>Rom 203 i Terningen</List.Item>
                                    <List.Item as='a'>Kundebehandler: Mona Ullah</List.Item>
                                    <List.Item as='a'>Tlf: +47 91009357</List.Item>
                                    <List.Item as='a'>Mail: monaullah98@gmail.com</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as='h4' inverted>
                                    Hva skjer her egt
                                </Header>
                                <p>Hmmmmm...</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
        );
    }
}
