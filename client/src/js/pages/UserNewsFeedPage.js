import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Rail, Segment, Sticky, Header, Icon, Divider, Dropdown } from 'semantic-ui-react';

import { NewsCaseWidget } from './../widgets/NewsCaseWidget';

export class UserNewsFeedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      municipals: [
        { key: 'a', value: 'a', text: 'Café with accent' },
        { key: 'b', value: 'b', text: 'Cafe without accent' },
        { key: 'c', value: 'c', text: 'Déjà vu' },
        { key: 'd', value: 'd', text: 'Deja vu' },
        { key: 'e', value: 'e', text: 'Scandinavian å ä æ ø ö' },
        { key: 'f', value: 'f', text: 'Scandinavian a a ae o o' }
      ],
      selectedMunicipals: [],
      categories: [
        { key: 'a', value: 'a', text: 'Café with accent' },
        { key: 'b', value: 'b', text: 'Cafe without accent' },
        { key: 'c', value: 'c', text: 'Déjà vu' },
        { key: 'd', value: 'd', text: 'Deja vu' },
        { key: 'e', value: 'e', text: 'Scandinavian å ä æ ø ö' },
        { key: 'f', value: 'f', text: 'Scandinavian a a ae o o' }
      ],
      selectedCategories: []
    };
  }

  selectMunicipal(value) {
    this.setState({ selectedMunicipals: value });
  }

  selectCategory(value) {
    this.setState({ selectedCategories: value });
  }

  render() {
    return (
      <Container>
        <Grid divided columns={2}>
          <Grid.Column width={5}>
            <Segment>
              <Header as="h5">
                <Icon name="filter" />
                <Header.Content>
                  Filter
                  <Header.Subheader>Endre hva som skal vises</Header.Subheader>
                </Header.Content>
              </Header>
              <Header as="h6">
                <Header.Subheader>Velg kommuner</Header.Subheader>
              </Header>
              <Dropdown
                deburr
                fluid
                options={this.state.municipals}
                value={this.state.selectedMunicipals}
                onChange={(event, data) => {
                  this.selectMunicipal(data.value);
                }}
                placeholder="Søk etter kommune"
                search
                multiple
                selection
              />
              <Header as="h6">
                <Header.Subheader>Velg kategorier</Header.Subheader>
              </Header>
              <Dropdown
                deburr
                fluid
                options={this.state.categories}
                value={this.state.selectedCategories}
                onChange={(event, data) => {
                  this.selectCategory(data.value);
                }}
                placeholder="Søk etter kommune"
                search
                multiple
                selection
              />
            </Segment>
          </Grid.Column>

          <Grid.Column width={11}>
            <NewsCaseWidget title="Problemer, problemer" />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
