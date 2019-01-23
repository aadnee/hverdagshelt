import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Container, Grid, Header, Divider, Segment, Tab} from 'semantic-ui-react';

import { companyService } from '../services/CompanyServices';

import {AssignmentWidget} from "../widgets/AssignmentWidget";
import {AssignmentRejectedWidgetWidget} from "../widgets/AssignmentRejectedWidget";

export class EntrepreneurAssignmentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assignments: []
        };
    }

    componentWillMount() {
        companyService.getTasks().then((res)=>{console.log(res);this.setState({assignments: res.res})});
    }

    render() {
        let panes = [
            {
                menuItem: 'Oppdragsforespørsler',
                render: () => (
                    <Tab.Pane className="companyAssignmentTab frontPageFeedTab">
                        {this.state.assignments.map((asg,i) => (<AssignmentWidget assignment={asg} newsOnly key={i}/>))}
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Aktive oppdrag',
                render: () => (
                    <Tab.Pane className="companyActiveAssignmentTab frontPageFeedTab">
                    <p>Hei</p>
                    </Tab.Pane>
                )
            }
        ];
        return (
            <>
                <Divider hidden/>
                <Divider hidden/>
                <Container width={11} floated='true'>
                    <Header as={'h1'}>Mine oppdrag</Header>
                    <Segment basic color='blue'>
                        <Tab menu={{text: true, secondary: true, pointing: true, color: 'blue'}} panes={panes}/>
                    </Segment>
                </Container>
            </>
        );
    }
}
