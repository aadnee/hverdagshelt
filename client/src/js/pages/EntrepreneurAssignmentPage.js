import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Divider, Segment, Tab } from 'semantic-ui-react';

import { companyService } from '../services/CompanyServices';

import {AssignmentWidget} from "../widgets/AssignmentWidget";
import {ActiveAssignmentWidget} from "../widgets/ActiveAssignmentWidget";

export class EntrepreneurAssignmentPage extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      assignments: []
    };
  }

  handleDelete = assigmentId => {
    this.state.assignments.map((assigment, index) => {
      if (assigment.id === assigmentId) {
        let tempAssigments = this.state.assignments;
        tempAssigments.splice(index, 1);
        this.setState({ assignments: tempAssigments });
      }
    });
  };

  handleAccept = assigmentId => {
    this.state.assignments.map((assigment, index) => {
      if (assigment.id === assigmentId) {
        let tempAssigments = this.state.assignments;
        let asg = this.state.assignments[index];
        tempAssigments.splice(index, 1, asg);
        this.setState({ assignments: tempAssigments });
      }
    });
  };

  componentWillMount() {
    companyService.getTasks().then(res => {
      console.log(res);
      this.setState({ assignments: res.res });
    });
  }

    render() {
        let panes = [
            {
                menuItem: 'Oppdragsforespørsler',
                render: () => (
                    <Tab.Pane className="companyAssignmentTab frontPageFeedTab">
                        {this.state.assignments.map((asg, i) => (
                            asg.companyStatus===1 ?
                            <AssignmentWidget handleAccept={this.handleAccept} handleDelete={this.handleDelete.bind(this, asg.id)} assignment={asg} newsOnly key={i} />:null
                        ))}
                    </Tab.Pane>)
            },
            {
                menuItem: 'Aktive oppdrag',
                render: () => (
                    <Tab.Pane className="companyActiveAssignmentTab frontPageFeedTab">
                        {this.state.assignments.map((asg, i) => (
                            asg.companyStatus === 2 ?
                                <ActiveAssignmentWidget assignment={asg} newsOnly key={i}/>
                            : null
                            ))
                        }
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
