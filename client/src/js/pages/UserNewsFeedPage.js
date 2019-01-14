import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Rail, Segment, Sticky, Header, Icon, Divider, Dropdown } from 'semantic-ui-react';

import { NewsCaseWidget } from './../widgets/NewsCaseWidget';

import { municipalServices } from './../services/MunicipalServices';
import { categoryServices } from './../services/CategoryServices';

export class UserNewsFeedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      municipals: [],
      selectedMunicipals: [],
      categories: [],
      selectedCategories: [],
      news: []
    };
  }

  componentWillMount() {
    municipalServices
      .getMunicipals()
      .then(res => {
        let muns = res.data.map(r => {
          return { key: r.id, value: r.name, text: r.name };
        });
        this.setState({ municipals: muns });
      })
      .catch(res => console.error(res));

    categoryServices
      .getCategories()
      .then(res => {
        let cat = res.data.map(r => {
          return { key: r.id, value: r.name, text: r.name };
        });
        this.setState({ categories: cat });
      })
      .catch(res => console.error(res));
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
