import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Divider, Segment, Tab, Button, Message, Icon } from 'semantic-ui-react';

import { companyService } from '../services/CompanyServices';

import { AssignmentWidget } from '../widgets/AssignmentWidget';
import { ActiveAssignmentWidget } from '../widgets/ActiveAssignmentWidget';

import { toast } from 'react-toastify';

export class EntrepreneurAssignmentPage extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleStatus = this.handleStatus.bind(this);

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

  handleStatus = (assigmentId, status) => {
    this.state.assignments.map((assigment, index) => {
      if (assigment.id === assigmentId) {
        let tempAssigments = this.state.assignments;
        tempAssigments[index].companyStatus = status;
        this.setState({ assignments: tempAssigments });
      }
    });
  };

  componentWillMount() {
    companyService.getTasks().then(res => {
      this.setState({ assignments: res.res });
    });
  }

  render() {
    let panes = [
      {
        menuItem: 'Forespørsler',
        render: () => (
          <Tab.Pane className="companyActiveAssignmentTab frontPageFeedTab">
            {console.log('status 1: ' + this.state.assignments.filter(res => res.companyStatus === 1).length)}
            {this.state.assignments.filter(res => res.companyStatus === 1).length > 0 ? (
              this.state.assignments.map((asg, i) =>
                asg.companyStatus === 1 ? (
                  <AssignmentWidget
                    handleStatus={this.handleStatus.bind(this, asg.id)}
                    handleDelete={this.handleDelete.bind(this, asg.id)}
                    assignment={asg}
                    newsOnly
                    key={i}
                  />
                ) : null
              )
            ) : (
              <Message icon success>
                <Icon name="folder open outline" />
                <Message.Content>
                  <Message.Header>Tomt!</Message.Header>
                  Det finnes ingen oppdragsforespørsler.
                </Message.Content>
              </Message>
            )}
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Aktiv',
        render: () => (
          <Tab.Pane className="companyActiveAssignmentTab frontPageFeedTab">
            {console.log('status 2: ' + this.state.assignments.filter(res => res.companyStatus === 2).length)}
            {this.state.assignments.filter(res => res.companyStatus === 2).length > 0 ? (
              this.state.assignments.map((asg, i) =>
                asg.companyStatus === 2 ? (
                  <ActiveAssignmentWidget
                    handleStatus={this.handleStatus.bind(this, asg.id)}
                    handleDelete={this.handleDelete.bind(this, asg.id)}
                    assignment={asg}
                    newsOnly
                    key={i}
                  />
                ) : null
              )
            ) : (
              <Message icon success>
                <Icon name="folder open outline" />
                <Message.Content>
                  <Message.Header>Tomt!</Message.Header>
                  Det finnes ingen aktive oppdrag
                </Message.Content>
              </Message>
            )}
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Fullført',
        render: () => (
          <Tab.Pane className="companyActiveAssignmentTab frontPageFeedTab">
            {console.log('status 3: ' + this.state.assignments.filter(res => res.companyStatus === 3).length)}
            {this.state.assignments.filter(res => res.companyStatus === 3).length > 0 ? (
              this.state.assignments.map((asg, i) =>
                asg.companyStatus === 3 ? (
                  <AssignmentWidget
                    handleStatus={this.handleStatus.bind(this, asg.id)}
                    handleDelete={this.handleDelete.bind(this, asg.id)}
                    assignment={asg}
                    newsOnly
                    disabled
                    key={i}
                  />
                ) : null
              )
            ) : (
              <Message icon success>
                <Icon name="folder open outline" />
                <Message.Content>
                  <Message.Header>Tomt!</Message.Header>
                  Det finnes ingen fullførte oppdrag.
                </Message.Content>
              </Message>
            )}
          </Tab.Pane>
        )
      }
    ];
    return (
      <>
        <Divider hidden />
        <Divider hidden />
        <Container width={11} floated="true">
          <Header as={'h1'}>Mine oppdrag</Header>
          <Segment basic color="blue">
            <Tab menu={{ text: true, secondary: true, pointing: true, color: 'blue' }} panes={panes} />
          </Segment>
        </Container>
      </>
    );
  }
}
