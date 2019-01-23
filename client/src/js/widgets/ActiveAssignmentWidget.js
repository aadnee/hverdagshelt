import React from 'react';
import {Component} from 'react';
import {Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button, Modal, Dropdown} from 'semantic-ui-react';
import {Consumer} from './../context';
import {ShowInMapWidget} from './ShowInMapWidget';
import {companyService} from "../services/CompanyServices";

export class ActiveAssignmentWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderMap: false,
            modal: false,
            modalType: ''
        };
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({renderMap: false});
    }

    closeModal = () => {
        this.setState({modal: false});
    };

    openModal = (modalType) => {
        this.setState({modal: true, modalType: modalType});
    };

    handleStatus() {
        console.log(this.state.modalType);
        if(this.state.modalType===''){
            console.log(this.state.id);
            companyService.rejectTask(this.state.id);
        }else if(this.state.modalType===''){
            companyService.finishTask(this.state.id);
        }
    }

    componentWillMount(){
        console.log(this.state.modalType);
    }

    render() {
        const assignment = this.props.assignment;
        const dateInfo = Consumer._currentValue.convDbString(assignment.createdAt);

        return (
            <Segment color="blue" fluid="true">
                <Container>
                    <Segment vertical>
                        <Header as="h2">{assignment.title}</Header>
                        <p>{dateInfo}</p>
                    </Segment>
                    <Segment vertical>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Column width={12} textAlign="left">
                                    <p>{assignment.description}</p>
                                </Grid.Column>
                                {assignment.uploads ? (
                                    assignment.uploads.length > 0 ? (
                                        <Grid.Column width={4} align="right" only="tablet computer">
                                            <Image fluid src={'/uploads/' + assignment.uploads[0].filename}
                                                   target="_blank"/>
                                        </Grid.Column>
                                    ) : null
                                ) : null}
                            </Grid>
                        </Container>
                    </Segment>
                    <List link>
                        <List.Item as="a">
                            <List.Content floated={'left'}>
                                Hendelses-adresse: {assignment.address},
                                <ShowInMapWidget
                                    callback={this.close}
                                    renderMap={this.state.renderMap}
                                    button={
                                        <span className="showInMap" onClick={() => this.setState({renderMap: true})}>
                                        vis i kart
                                        </span>
                                    }
                                    latlng={[assignment.lat, assignment.lon]}
                                />
                            </List.Content>
                        </List.Item>
                    </List>
                        {/*<Button positive onClick={() => this.openModal("acceptModal")}>Ta oppdrag</Button>*/}
                        <Dropdown text='Sett status'>
                            <Dropdown.Menu>
                                <Dropdown.Item icon='check circle outline' text='Avbryt oppdrag'/>
                                <Dropdown.Item icon='times circle outline' text='Oppdrag ferdig'/>
                            </Dropdown.Menu>
                        </Dropdown>
                </Container>
                <Modal size={'tiny'} open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header>
                        Er du sikker?
                    </Modal.Header>
                    <Modal.Actions>
                        <Button positive onClick={this.handleAssignment}>Ja</Button>
                        <Button color='red' onClick={this.closeModal}>Nei</Button>
                    </Modal.Actions>
                </Modal>
            </Segment>
        );
    }
}