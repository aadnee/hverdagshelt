import React from 'react';
import { Component } from 'react';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Segment, Header, Icon, Divider, Dropdown, Message, Button } from 'semantic-ui-react';

import { NewsCaseWidget } from './../widgets/NewsCaseWidget';

import { municipalService } from './../services/MunicipalServices';
import { categoryService } from './../services/CategoryServices';
import { newsService } from './../services/NewsServices';

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
    this.setState({ loading: true });
    let munRes = municipalService
      .getMunicipals()
      .then(res => {
        const munID = Cookies.get('municipalId');
        let muns = res.data.map(r => {
          return { key: r.id, value: r.name, text: r.name };
        });
        let userMun = muns.find(mun => {
          return mun.key == munID;
        });
        this.setState({ municipals: muns, selectedMunicipals: [userMun.text] });
        return muns;
      })
      .catch(res => console.error(res));

    let catRes = categoryService
      .getCategories()
      .then(res => {
        let cats = res.data.map(r => {
          return { key: r.id, value: r.name, text: r.name };
        });
        this.setState({ categories: cats });
        return cats;
      })
      .catch(res => console.error(res));

    Promise.all([munRes, catRes])
      .then(() => {
        this.getNews();
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  getNews() {
    this.setState({ loading: true });
    setTimeout(() => {
      newsService
        .getFilteredNews(Cookies.get('municipalId'), [1]) // Second param is category ids
        .then(res => {
          this.setState({ news: res.data, loading: false });
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false });
        });
    }, 10);
  }

  selectMunicipal(value) {
    this.setState({ selectedMunicipals: value });
    this.getNews();
  }

  selectCategory(value) {
    this.setState({ selectedCategories: value });
    this.getNews();
  }

  render() {
    return (
      <Container>
        <Header as="h2">Nyhetsstrøm</Header>
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
              <Divider hidden />
              <Button
                primary
                onClick={() => {
                  this.getNews();
                }}
              >
                Oppdater
              </Button>
            </Segment>
          </Grid.Column>

          <Grid.Column width={11}>
            {this.state.loading ? (
              <Message icon>
                <Icon name="circle notched" loading />
                <Message.Content>
                  <Message.Header>Vennligst vent</Message.Header>
                  Henter informasjon
                </Message.Content>
              </Message>
            ) : this.state.news > 0 ? (
              this.state.news.map(nc => <NewsCaseWidget key={nc.id} newscase={nc} />)
            ) : (
              <Message icon success>
                <Icon name="thumbs up outline" />
                <Message.Content>
                  <Message.Header>Tomt!</Message.Header>
                  Vi finner ingen nyhetsoppdateringer til de valgte kommunene.
                </Message.Content>
              </Message>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
