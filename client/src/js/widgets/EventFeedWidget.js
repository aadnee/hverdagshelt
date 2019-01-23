import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Segment, Header, Icon, Dropdown, Button, Grid, Divider, Message } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Consumer } from './../context';

import { municipalService } from './../services/MunicipalServices';
import { categoryService } from './../services/CategoryServices';
import { eventService } from './../services/EventServices';
import { userService } from './../services/UserServices';

import { EventWidget } from './EventWidget';

export class EventFeedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      municipals: [],
      selectedMunicipals: [],
      categories: [],
      selectedCategories: [],
      news: [],
      page: 2,
      limit: 3,
      empty: false
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    if (Consumer._currentValue.user) {
      let munRes = municipalService
        .getMunicipals()
        .then(municipals => {
          userService
            .getMunicipals()
            .then(myMunicipals => {
              let allMunicipals = municipals.data.map(m => {
                return { key: m.id, value: m.id, text: m.name };
              });
              let allMyMunicipals = myMunicipals.data.map(m => {
                return m.id;
              });
              this.setState({ municipals: allMunicipals, selectedMunicipals: allMyMunicipals });
              return allMunicipals;
            })
            .catch(res => console.error(res));
        })
        .then(() => {
          this.getNews();
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    } else {
      let munRes = municipalService
        .getMunicipals()
        .then(municipals => {
          let allMunicipals = municipals.data.map(m => {
            return { key: m.id, value: m.id, text: m.name };
          });
          let allMyMunicipals = municipals.data.map(m => {
            if (m.id == 1) {
              //TRONDHEIM KOMMUNE = 1
              return m.id;
            }
          });
          this.setState({ municipals: allMunicipals, selectedMunicipals: allMyMunicipals });
          return allMunicipals;
        })
        .then(() => {
          this.getNews();
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    }
  }

  getNews() {
    this.setState({ loading: true });
    setTimeout(() => {
      eventService
        .getFilteredEvents(this.state.selectedMunicipals, 1, this.state.limit)
        .then(res => {
          if (res.success) {
            this.setState({ news: res.data, loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false });
        });
    }, 10);
  }

  loadMoreNews() {
    eventService
      .getFilteredEvents(
        this.state.selectedMunicipals,
        this.state.selectedCategories,
        this.state.page,
        this.state.limit
      )
      .then(res => {
        if (res.data.length == 0) {
          toast.warning('Ingen flere nyheter å laste', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          this.setState({ empty: true });
        } else {
          this.setState({ news: this.state.news.concat(res.data), page: this.state.page + 1 });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  selectMunicipal(value) {
    this.setState({ selectedMunicipals: value });
    this.getNews();
  }

  selectCategory(value) {
    this.setState({ selectedCategories: value });
    this.getNews();
  }

  displayNews = () => {
    if (this.state.loading) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Vennligst vent</Message.Header>
            Henter informasjon
          </Message.Content>
        </Message>
      );
    } else if (this.state.news.length > 0) {
      return (
        <>
          {this.state.news.map(nc => (
            <EventCaseWidget key={nc.id} event={nc} />
          ))}
          {!this.state.empty ? (
            <Button
              primary
              onClick={() => {
                this.loadMoreNews();
              }}
            >
              Last inn flere
            </Button>
          ) : null}
        </>
      );
    } else {
      return (
        <Message icon success>
          <Icon name="folder open outline" />
          <Message.Content>
            <Message.Header>Tomt!</Message.Header>
            Vi finner ingen arrangementer for dine valgte kommunene.
          </Message.Content>
        </Message>
      );
    }
  };

  render() {
    if (this.props.newsOnly) {
      return <>{this.displayNews()}</>;
    }
    return (
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
        <Grid.Column width={11}>{this.displayNews()}</Grid.Column>
      </Grid>
    );
  }
}
